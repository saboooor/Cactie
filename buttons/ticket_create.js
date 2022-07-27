const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	name: 'create_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Create and show a modal for the user to fill out the ticket's description
			const modal = new ModalBuilder()
				.setTitle('Create Ticket')
				.setCustomId('ticket_create')
				.addComponents([
					new ActionRowBuilder().addComponents([
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
		catch (err) { client.error(err, interaction); }
	},
};