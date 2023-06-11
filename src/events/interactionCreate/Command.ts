import prisma, { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, CommandInteraction, GuildMember, GuildChannelResolvable, TextChannel, ApplicationCommandOptionType } from 'discord.js';
import checkPerms from '~/functions/checkPerms';
import { cooldowns } from '~/lists/commands';
import slashcommands from '~/lists/slash';
import cooldownMessages from '~/misc/cooldown.json';

export default async (client: Client, interaction: CommandInteraction) => {
  // Check if interaction is command
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) return;

  // Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
  const command = slashcommands.get(interaction.commandName);
  if (!command) return;

  // Get server config
  const srvconfig = await getGuildConfig(interaction.guild!.id);
  if (srvconfig.disabledcmds.includes(command.name!)) return interaction.reply({ content: `${command.name} is disabled on this server.`, ephemeral: true });

  // Make args variable from interaction options for compatibility with dash command code
  const args: string[] = [];

  interaction.options.data.map(option => {
    if (option.type == ApplicationCommandOptionType.Subcommand) {
      args.push(option.name);
      option.options?.forEach(suboption => {
        args.push(`${suboption.value}`);
      });
    }
    else { args.push(`${option.value}`); }
  });

  // Get cooldowns and check if cooldown exists, if not, create it
  if (!cooldowns.has(command.name!)) cooldowns.set(command.name!, new Collection());

  // Get current timestamp and the command's last used timestamps
  const now = Date.now();
  const timestamps = cooldowns.get(command.name!) as Collection<string, number>;

  // Calculate the cooldown in milliseconds (default is 3600 miliseconds, idk why)
  const cooldownAmount = (command.cooldown || 3) * 1200;

  // Check if user is in the last used timestamp
  if (timestamps.has(interaction.user.id)) {
    // Get a random cooldown message
    const random = Math.floor(Math.random() * cooldownMessages.length);

    // Get cooldown expiration timestamp
    const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

    // If cooldown expiration hasn't passed, send cooldown message
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      const cooldownEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(cooldownMessages[random])
        .setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
      return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
    }
  }

  // Set last used timestamp to now for user and delete the timestamp after cooldown passes
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  // Check if command can be ran only if the user voted since the past 24 hours
  if (command.voteOnly) {
    // Get data for user
    const userdata = await prisma.userdata.findUnique({ where: { userId: interaction.user.id } });

    // If user has not voted since the past 24 hours, send error message with vote buttons
    if (!userdata || Date.now() > Number(userdata.lastvoted) + 86400000) {
      const errEmbed = new EmbedBuilder().setTitle(`You need to vote to use ${command.name}! Vote below!`)
        .setDescription('Voting helps us get Cactie in more servers!\nIt\'ll only take a few seconds!');
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL(`https://top.gg/bot/${client.user?.id}/vote`)
            .setLabel('top.gg')
            .setStyle(ButtonStyle.Link),
        ]);
      return interaction.reply({ embeds: [errEmbed], components: [row] });
    }
  }

  // Log
  const cmdlog = args.join ? `${command.name} ${args.join(' ')}` : command.name;
  logger.info(`${interaction.user.username} issued slash command: /${cmdlog}, in ${interaction.guild.name}`.replace(' ,', ','));

  // Check if user has the permissions necessary in the channel to use the command
  if (command.channelPermissions) {
    const permCheck = checkPerms(command.channelPermissions, interaction.member as GuildMember, interaction.channel as GuildChannelResolvable);
    if (permCheck) return error(permCheck, interaction, true);
  }

  // Check if user has the permissions necessary in the guild to use the command
  if (command.permissions) {
    const permCheck = checkPerms(command.permissions, interaction.member as GuildMember);
    if (permCheck) return error(permCheck, interaction, true);
  }

  // Check if bot has the permissions necessary in the channel to run the command
  if (command.botChannelPerms) {
    const permCheck = checkPerms(command.botChannelPerms, interaction.guild.members.me!, interaction.channel as GuildChannelResolvable);
    if (permCheck) return error(permCheck, interaction, true);
  }

  // Check if bot has the permissions necessary in the guild to run the command
  if (command.botPerms) {
    const permCheck = checkPerms(command.botPerms, interaction.guild.members.me!);
    if (permCheck) return error(permCheck, interaction, true);
  }

  // Defer and execute the command
  try {
    if (!command.noDefer) {
      await interaction.deferReply({ ephemeral: command.ephemeral });
      interaction.reply = interaction.editReply as typeof interaction.reply;
    }
    command.execute(interaction, args, client);
  }
  catch (err) {
    const interactionFailed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('INTERACTION FAILED')
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })
      .addFields([
        { name: '**Type:**', value: 'Slash' },
        { name: '**Interaction:**', value: `${command.name}` },
        { name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
        { name: '**Guild:**', value: interaction.guild.name },
        { name: '**Channel:**', value: `${interaction.channel}` },
      ]);
    const errorchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630')! as TextChannel;
    errorchannel.send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
    interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
    logger.error(err);
  }
};