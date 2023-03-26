const reopenTicket = require('../../functions/tickets/reopenTicket.js');

module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	ephemeral: true,
	aliases: ['reopen'],
	botPerms: ['ManageChannels'],
	async execute(message, args, client) {
		try {
			// Get the server config
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Create a ticket
			const msg = await reopenTicket(client, srvconfig, message.member, message.channel);

			// Send the message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};