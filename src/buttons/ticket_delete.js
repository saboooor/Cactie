const deleteTicket = require('../functions/tickets/deleteTicket').default;

module.exports = {
	name: 'delete_ticket',
	botPerms: ['ManageChannels'],
	deferReply: true,
	async execute(interaction) {
		// Delete the ticket
		try { await deleteTicket(interaction.channel); }
		catch (err) { error(err, interaction, true); }
	},
};