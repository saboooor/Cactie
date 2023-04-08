const createTicket = require('../../functions/tickets/createTicket').default;

module.exports = {
	name: 'ticket',
	description: 'Create a ticket',
	ephemeral: true,
	aliases: ['new'],
	usage: '[Description]',
	botPerms: ['ManageChannels'],
	options: require('../../options/ticket').default,
	async execute(message, args, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Create a ticket
			const msg = await createTicket(client, srvconfig, message.member, args.join(' '));

			// Send the message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};