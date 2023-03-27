const deleteTicket = require('../../functions/tickets/deleteTicket').default;

module.exports = {
	name: 'forcedelete',
	description: 'Force delete a ticket',
	ephemeral: true,
	permissions: ['Administrator'],
	botPerms: ['ManageChannels'],
	async execute(message) {
		// Create a ticket
		try { await deleteTicket(message.channel, true); }
		catch (err) { error(err, message, true); }
	},
};