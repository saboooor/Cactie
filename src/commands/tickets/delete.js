const deleteTicket = require('../../functions/tickets/deleteTicket').default;

module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	ephemeral: true,
	permissions: ['Administrator'],
	botPerms: ['ManageChannels'],
	async execute(message) {
		// Delete the ticket
		try { await deleteTicket(message.channel); }
		catch (err) { error(err, message, true); }
	},
};