import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const name = 'create_ticket';
export const botPerms = ['ManageChannels'];
export const noDefer = true;
export const ephemeral = true;

export async function execute(interaction: ButtonInteraction) {
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
