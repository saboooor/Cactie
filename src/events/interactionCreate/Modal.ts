import { Client, EmbedBuilder, InteractionType, ModalSubmitInteraction, TextChannel } from 'discord.js';
import modals from '~/lists/modals';

export default async (client: Client<true>, interaction: ModalSubmitInteraction) => {
  // Check if interaction is modal
  if (interaction.type != InteractionType.ModalSubmit) return;
  if (!interaction.inCachedGuild()) return;

  // There may be extra data along with the customId, so we split it and get the first part as the id
  const IdWithArgs = interaction.customId;
  const Id = IdWithArgs?.split('|')[0];
  const args = IdWithArgs?.split('|').slice(1);
  if (!Id) return;

  // Defer and execute the modal
  try {
    logger.info(`${interaction.user.username} submitted modal: ${modal.name}, in ${interaction.guild.name}`);
    if (modal.defer) await interaction[modal.defer == 'reply' ? 'deferReply' : 'deferUpdate']({ flags: modal.flags });
    modal.execute(interaction, client, args);
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