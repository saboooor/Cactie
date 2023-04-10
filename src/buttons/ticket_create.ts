import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from 'types/Objects';

export const create_ticket: Button = {
	botPerms: ['ManageChannels'],
	noDefer: true,
	ephemeral: true,
	execute: async (interaction) => {
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
		catch (err) { error(err, interaction); }
	}
}