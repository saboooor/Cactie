const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	name: 'subticket_create',
	botperm: 'CreatePublicThreads',
	deferReply: true,
	ephemeral: true,
	noDefer: true,
	async execute(interaction, client) {
		try {
			// Create and show a modal for the user to fill out the ticket's description
			const modal = new ModalBuilder()
				.setTitle('Create Subticket')
				.setCustomId('subticket_create')
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId('description')
							.setLabel('Please explain your issue before opening.')
							.setStyle(TextInputStyle.Paragraph)
							.setMinLength(10)
							.setMaxLength(1024),
					),
				);
			interaction.showModal(modal);
		}
		catch (err) { client.error(err, interaction); }
	},
};