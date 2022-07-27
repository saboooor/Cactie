const deleteTicket = require('../../functions/tickets/deleteTicket.js');
module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	ephemeral: true,
	permission: 'Administrator',
	botperm: 'ManageChannels',
	async execute(message, user, client) {
		try {
			// Get the server config
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

			// Create a ticket
			await deleteTicket(client, srvconfig, message.member, message.channel);
		}
		catch (err) { client.error(err, message, true); }
	},
};