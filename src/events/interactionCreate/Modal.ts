import { Client, EmbedBuilder, InteractionType, ModalSubmitInteraction, TextChannel } from 'discord.js';
import modals from '~/lists/modals';

export default async (client: Client, interaction: ModalSubmitInteraction) => {
  // Check if interaction is modal
  if (interaction.type != InteractionType.ModalSubmit) return;
  if (!interaction.inCachedGuild()) return;

  // Get the modal from the available modals in the bot, if there isn't one, just return because discord will throw an error itself
  const customIdSplit = interaction.customId.split('_');
  const modalInfo = customIdSplit.pop();
  const modalName = customIdSplit.join('_');
  let modal = modals.get(interaction.customId);
  if (!modal) modal = modals.get(modalName);
  if (!modal) return;

  // Defer and execute the modal
  try {
    logger.info(`${interaction.user.username} submitted modal: ${modal.name}, in ${interaction.guild.name}`);
    await interaction[modal.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: modal.ephemeral });
    interaction.reply = interaction.editReply as typeof interaction.reply;
    modal.execute(interaction, client, modalInfo!);
  }
  catch (err) {
    const interactionFailed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('INTERACTION FAILED')
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() ?? undefined })
      .addFields([
        { name: '**Type:**', value: 'Modal' },
        { name: '**Interaction:**', value: `${modal.name}` },
        { name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
      ]);
    if (interaction.guild) interactionFailed.addFields([{ name: '**Guild:**', value: interaction.guild.name }, { name: '**Channel:**', value: `${interaction.channel}` }]);
    const errorchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630') as TextChannel;
    errorchannel.send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
    interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
    logger.error(err);
  }
};