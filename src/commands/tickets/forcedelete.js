const deleteTicket = require('../../functions/tickets/deleteTicket.js');

module.exports = {
	name: 'forcedelete',
	description: 'Force delete a ticket',
	ephemeral: true,
	permissions: ['Administrator'],
	botPerms: ['ManageChannels'],
	async execute(message, user, client) {
		try {
			// Get the server config
			const srvconfig = await client.getData('settings', { guildId: message.guild.id });

			// Create a ticket
			await deleteTicket(client, srvconfig, message.member, message.channel, true);
		}
		catch (err) { client.error(err, message, true); }
	},
};