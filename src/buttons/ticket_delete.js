const deleteTicket = require('../functions/tickets/deleteTicket.js');

module.exports = {
	name: 'delete_ticket',
	botPerms: ['ManageChannels'],
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Get the server config
			const srvconfig = await sql.getData('settings', { guildId: interaction.guild.id });

			// Create a ticket
			await deleteTicket(client, srvconfig, interaction.member, interaction.channel);
		}
		catch (err) { client.error(err, interaction, true); }
	},
};