import { SlashCommand } from '~/types/Objects';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const ticket: SlashCommand<'cached'> = {
  description: 'Create a ticket',
  noDefer: true,
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    try {
      // Create and show a modal for the user to fill out the ticket's description
      const modal = new ModalBuilder()
        .setTitle('Create Ticket')
        .setCustomId('ticket_create')
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('Please explain your issue before opening.')
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(10)
              .setMaxLength(1024),
          ]),
        ]);
      interaction.showModal(modal);
    }
    catch (err) { error(err, interaction, true); }
  },
};