const resolveTicket = require('../../functions/tickets/resolveTicket').default;

module.exports = {
	name: 'resolve',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	ephemeral: true,
	aliases: ['resolved'],
	async execute(message) {
		try {
			// Add user to ticket
			const msg = await resolveTicket(message.member, message.channel);

			// Send message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};