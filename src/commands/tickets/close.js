const closeTicket = require('../../functions/tickets/closeTicket').default;

module.exports = {
	name: 'close',
	description: 'Close a ticket',
	ephemeral: true,
	botPerms: ['ManageChannels'],
	async execute(message) {
		try {
			// Get the server config
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Create a ticket
			const msg = await closeTicket(srvconfig, message.member, message.channel);

			// Send the message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};