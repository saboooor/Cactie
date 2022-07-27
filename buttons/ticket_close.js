const closeTicket = require('../functions/tickets/closeTicket.js');
module.exports = {
	name: 'close_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

			// Create a ticket
			const msg = await closeTicket(client, srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { client.error(err, interaction); }
	},
};