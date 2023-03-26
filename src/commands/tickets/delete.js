const deleteTicket = require('../../functions/tickets/deleteTicket.js');

module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	ephemeral: true,
	permissions: ['Administrator'],
	botPerms: ['ManageChannels'],
	async execute(message, user, client) {
		try {
			// Get the server config
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Create a ticket
			await deleteTicket(client, srvconfig, message.member, message.channel);
		}
		catch (err) { error(err, message, true); }
	},
};