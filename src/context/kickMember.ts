import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ContextMenuCommand } from '~/types/Objects';

export const context: ContextMenuCommand<'User'> = {
  name: 'Kick Member',
  noDefer: true,
  permissions: ['KickMembers'],
  botPerms: ['KickMembers'],
  type: 'User',
  async execute(interaction, client, member) {
    try {
      // Create and show a modal for the user to fill out the ticket's description
      const modal = new ModalBuilder()
        .setTitle(`Kick ${member.user.tag}`)
        .setCustomId(`kick_${member.id}`)
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Reason')
              .setPlaceholder('No reason given. (Example: Spamming)')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false),
          ]),
        ]);
      interaction.showModal(modal);
    }
    catch (err) { error(err, interaction); }
  },
};