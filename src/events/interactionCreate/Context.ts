import { Client, ContextMenuCommandInteraction, EmbedBuilder, GuildMember, Message, TextChannel } from 'discord.js';
import checkPerms from '~/functions/checkPerms';
import contextcommands from '~/lists/context';

export default async (client: Client, interaction: ContextMenuCommandInteraction) => {
  // Check if interaction is context menu
  if (!interaction.isContextMenuCommand()) return;
  if (!interaction.inCachedGuild()) return;

  // Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
  const command = contextcommands.get(interaction.commandName);
  if (!command) return;

  // Check if bot has the permissions necessary in the guild to run the command
  if (command.botPerms) {
    const permCheck = checkPerms(command.botPerms, interaction.guild.members.me!);
    if (permCheck) return error(permCheck, interaction, true);
  }

  // Set item to the command type
  const item = command.type == 'User' ? await interaction.guild.members.fetch(interaction.targetId) : await interaction.channel!.messages.fetch(interaction.targetId);

  // Defer and execute the command
  try {
    if (!command.noDefer) {
      await interaction.deferReply({ ephemeral: command.ephemeral });
      interaction.reply = interaction.editReply as typeof interaction.reply;
    }
    logger.info(`${interaction.user.username} issued context menu command: '${command.name}' with target: ${item?.id}, in ${interaction.guild.name}`.replace(' ,', ','));
    command.execute(interaction, client, item as Message<true> & GuildMember);
  }
  catch (err) {
    const interactionFailed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('INTERACTION FAILED')
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })
      .addFields([
        { name: '**Type:**', value: 'Context Menu' },
        { name: '**Interaction:**', value: `${command.name}` },
        { name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
      ]);
    const errorchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630') as TextChannel;
    errorchannel.send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
    interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
    logger.error(err);
  }
};