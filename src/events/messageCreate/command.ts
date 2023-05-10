import { PrismaClient } from '@prisma/client';
import { EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, Message, TextChannel } from 'discord.js';
import checkPerms, { PermissionChannel } from '~/functions/checkPerms';
import commands, { cooldowns } from '~/lists/commands';
import cooldownMessages from '~/misc/cooldown.json';

export default async (client: Client, message: Message<true>) => {
  // If the bot can't read message history or send messages, don't execute a command
  if (message.webhookId || message.author.bot) return;
  if (!message.guild) return;
  const initialPermCheck = checkPerms(['SendMessages', 'ReadMessageHistory'], message.guild.members.me!, message.channel as PermissionChannel);
  if (initialPermCheck) return;

  // // make a custom function to replace message.reply
  // // this is to send the message to the channel without a reply if reply fails
  // (message as any).msgreply = message.reply;
  // message.reply = async function reply(object) {
  //   try {
  //     return await (message as any).msgreply(object);
  //   }
  //   catch (err) {
  //     logger.warn(err);
  //     return await message.channel.send(object);
  //   }
  // };

  // Get server config
  const prisma = new PrismaClient();
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
  if (!srvconfig) return;

  // Use mention as prefix instead of prefix too
  let txtprefix;
  if (message.content.replace('!', '').startsWith(`<@${client.user!.id}>`)) {
    txtprefix = srvconfig.prefix;
    srvconfig.prefix = message.content.split('>')[0] + '>';
  }

  // If message doesn't start with the prefix, return
  // Also unresolve the ticket if channel is a resolved ticket
  if (!message.content.startsWith(srvconfig.prefix)) {
    // If message has the bot's Id, reply with prefix
    if (message.content.includes(client.user!.id)) {
      const prefix = await message.reply({ content: `**My prefix is ${txtprefix ? txtprefix : srvconfig.prefix}**\nIf my commands don't work:\n- try using slash commands (/)\n- Use my mention as a prefix (${client.user})` });
      setTimeout(() => { prefix.delete().catch(err => logger.error(err)); }, 10000);
    }

    // Check if channel is a ticket
    const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: message.channel.id } });
    if (ticketData && ticketData.resolved == 'true') {
      prisma.ticketdata.update({ where: { channelId: message.channel.id }, data: { resolved: 'false' } });
      logger.info(`Unresolved #${(message.channel as TextChannel).name}`);
    }
    return;
  }

  // Get args by splitting the message by the spaces and getting rid of the prefix
  const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);
  if (!args[0]) return;

  // Get the command name from the first arg and get rid of the first arg
  const commandName = (args.shift() as string).toLowerCase();

  // Get the command from the commandName, if it doesn't exist, return
  const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command || !command.name) {
    // If message has the bot's Id, reply with prefix
    if (message.content.includes(client.user!.id)) {
      const prefix = await message.reply({ content: `**My prefix is ${txtprefix ? txtprefix : srvconfig.prefix}**\nIf my commands don't work:\n- try using slash commands (/)\n- Use my mention as a prefix (${client.user})` });
      setTimeout(() => { prefix.delete().catch(err => logger.error(err)); }, 10000);
    }
    return;
  }

  // Check if command is disabled
  if (srvconfig.disabledcmds.includes(command.name)) return message.reply({ content: `${commandName} is disabled on this server.` });

  // Start typing (basically to mimic the defer of interactions)
  await message.channel.sendTyping();

  // Get cooldowns and check if cooldown exists, if not, create it
  if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

  // Get current timestamp and the command's last used timestamps
  const now = Date.now();
  const timestamps = cooldowns.get(command.name) as Collection<string, number>;

  // Calculate the cooldown in milliseconds (default is 3600 miliseconds, idk why)
  const cooldownAmount = (command.cooldown || 3) * 1200;

  // Check if user is in the last used timestamp
  if (timestamps.has(message.author.id)) {
    // Get a random cooldown message
    const random = Math.floor(Math.random() * cooldownMessages.length);

    // Get cooldown expiration timestamp
    const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

    // If cooldown expiration hasn't passed, send cooldown message and if the cooldown is less than 1200ms, react instead
    if (now < expirationTime && message.author.id != '249638347306303499') {
      const timeLeft = (expirationTime - now) / 1000;
      if ((expirationTime - now) < 1200) return message.react('⏱️').catch(err => logger.error(err));
      const cooldownEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(cooldownMessages[random])
        .setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
      return message.reply({ embeds: [cooldownEmbed] });
    }
  }

  // Set last used timestamp to now for user and delete the timestamp after cooldown passes
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Check if args are required and see if args are there, if not, send error
  if (command.args && args.length < 1) {
    const Usage = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('Usage')
      .setDescription(`\`\`\`\n${srvconfig.prefix + command.name + ' ' + command.usage}\n\`\`\``);
    return message.reply({ embeds: [Usage] });
  }

  // Check if command can be ran only if the user voted since the past 24 hours
  if (command.voteOnly) {
    // Get vote data for user
    const vote = await prisma.lastvoted.findUnique({ where: { userId: message.author.id } });

    // If user has not voted since the past 24 hours, send error message with vote buttons
    if (!vote || Date.now() > Number(vote.timestamp) + 86400000) {
      const errEmbed = new EmbedBuilder().setTitle(`You need to vote to use ${command.name}! Vote below!`)
        .setDescription('Voting helps us get Cactie in more servers!\nIt\'ll only take a few seconds!');
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL(`https://top.gg/bot/${client.user!.id}/vote`)
            .setLabel('top.gg')
            .setStyle(ButtonStyle.Link),
        ]);
      return message.reply({ embeds: [errEmbed], components: [row] });
    }
  }

  // Log
  logger.info(`${message.author.tag} issued message command: ${message.content}, in ${message.guild.name}`);

  // Check if user has the permissions necessary in the channel to use the command
  if (command.channelPermissions) {
    const permCheck = checkPerms(command.channelPermissions, message.member!, message.channel as PermissionChannel);
    if (permCheck) return error(permCheck, message, true);
  }

  // Check if user has the permissions necessary in the guild to use the command
  if (command.permissions) {
    const permCheck = checkPerms(command.permissions, message.member!);
    if (permCheck) return error(permCheck, message, true);
  }

  // Check if bot has the permissions necessary in the channel to run the command
  if (command.botChannelPerms) {
    const permCheck = checkPerms(command.botChannelPerms, message.guild.members.me!, message.channel as PermissionChannel);
    if (permCheck) return error(permCheck, message, true);
  }

  // Check if bot has the permissions necessary in the guild to run the command
  if (command.botPerms) {
    const permCheck = checkPerms(command.botPerms, message.guild.members.me!);
    if (permCheck) return error(permCheck, message, true);
  }

  // execute the command
  try {
    command.execute(message, args, client);
  }
  catch (err) {
    const interactionFailed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('INTERACTION FAILED')
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() ?? undefined })
      .addFields([
        { name: '**Type:**', value: 'Message' },
        { name: '**Guild:**', value: message.guild.name },
        { name: '**Channel:**', value: `${message.channel}` },
        { name: '**INTERACTION:**', value: srvconfig.prefix + command.name },
        { name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
      ]);
    const errorchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630')! as TextChannel;
    errorchannel.send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
    message.author.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
    logger.error(err);
  }
};