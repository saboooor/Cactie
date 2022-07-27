const deleteTicket = require('../functions/tickets/deleteTicket.js');
module.exports = {
	name: 'delete_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Get the server config
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

			// Create a ticket
			await deleteTicket(client, srvconfig, interaction.member, interaction.channel);
		}
		catch (err) { client.error(err, interaction); }
	},
};