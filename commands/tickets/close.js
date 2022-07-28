const closeTicket = require('../../functions/tickets/closeTicket.js');

module.exports = {
	name: 'close',
	description: 'Close a ticket',
	ephemeral: true,
	botperm: 'ManageChannels',
	async execute(message, args, client) {
		try {
			// Get the server config
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

			// Create a ticket
			const msg = await closeTicket(client, srvconfig, message.member, message.channel);

			// Send the message
			await message.reply(msg);
		}
		catch (err) { client.error(err, message, true); }
	},
};