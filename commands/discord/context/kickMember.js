const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	name: 'Kick Member',
	noDefer: true,
	permission: 'KickMembers',
	botperm: 'KickMembers',
	type: 'User',
	async execute(interaction, client, member) {
		try {
			// Create and show a modal for the user to fill out the ticket's description
			const modal = new ModalBuilder()
				.setTitle(`Kick ${member.user.tag}`)
				.setCustomId(`kick_${member.id}`)
				.addComponents([
					new ActionRowBuilder().addComponents([
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
		catch (err) { client.error(err, interaction); }
	},
};