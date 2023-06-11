import prisma, { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Collection, Client, Message, TextChannel } from 'discord.js';
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
  const srvconfig = await getGuildConfig(message.guild!.id);

  if (message.content.startsWith(srvconfig.prefix)) {
    message.reply({ content: `**Text commands have been deprecated.**\nIn order to use this command, please use Slash (/) commands instead of text.\nTo override this message, use ${client.user} as a prefix, keep in mind that this override will also be removed when text commands are fully removed.` });
    return;
  }

  // If message doesn't start with the prefix, return
  // Also unresolve the ticket if channel is a resolved ticket
  if (!message.content.replace('!', '').startsWith(`<@${client.user!.id}>`)) {
    // Check if channel is a ticket
    const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: message.channel.id } });
    if (ticketData && ticketData.resolved == 'true') {
      prisma.ticketdata.update({ where: { channelId: message.channel.id }, data: { resolved: 'false' } });
      logger.info(`Unresolved #${(message.channel as TextChannel).name}`);
    }
    return;
  }

  const prefix = message.content.split('>')[0] + '>';

  // Get args by splitting the message by the spaces and getting rid of the prefix
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  if (!args[0]) return;

  // Get the command name from the first arg and get rid of the first arg
  const commandName = (args.shift() as string).toLowerCase();

  // Get the command from the commandName, if it doesn't exist, return
  const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command || !command.name) {
    // If message has the bot's Id, reply with prefix
    if (message.content.includes(client.user!.id)) {
      const himsg = await message.reply({ content: `**Hi! I'm ${client.user?.username}**\nIf my commands don't work:\n- try using slash commands (/)\n- Use my mention as a prefix (${client.user})` });
      setTimeout(() => { himsg.delete().catch(err => logger.error(err)); }, 10000);
    }
    // Check if channel is a ticket
    const ticketData = await prisma.ticketdata.findUnique({ where: { channelId: message.channel.id } });
    if (ticketData && ticketData.resolved == 'true') {
      prisma.ticketdata.update({ where: { channelId: message.channel.id }, data: { resolved: 'false' } });
      logger.info(`Unresolved #${(message.channel as TextChannel).name}`);
    }
    return;
  }

  // Check if command is disabled
  if (srvconfig.disabledcmds.includes(command.name)) return message.reply({ content: `${commandName} is disabled on this server.` });

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
  if ((command.args && args.length < 1) || command.voteOnly || command.channelPermissions || command.permissions) return message.reply('**This text command is no longer available** Please use the slash (/) command.');

  // Log
  logger.info(`${message.author.username} issued message command: ${message.content}, in ${message.guild.name}`);

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
  try { command.execute(message, args, client); }
  catch (err) { message.reply('This text command has ran into an error and no longer is supported. Please use the slash (/) command instead.'); }
};