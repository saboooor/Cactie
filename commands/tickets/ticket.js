const createTicket = require('../../functions/tickets/createTicket.js');
module.exports = {
	name: 'ticket',
	description: 'Create a ticket',
	ephemeral: true,
	aliases: ['new'],
	usage: '[Description]',
	botperm: 'ManageChannels',
	options: require('../../options/ticket.js'),
	async execute(message, args, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

			// Create a ticket
			const msg = await createTicket(client, srvconfig, message.member, args.join(' '));

			// Send the message
			message.reply(msg);
		}
		catch (err) { client.error(err, message, true); }
	},
};