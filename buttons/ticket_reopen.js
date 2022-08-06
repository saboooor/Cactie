const reopenTicket = require('../functions/tickets/reopenTicket.js');

module.exports = {
	name: 'reopen_ticket',
	botPerms: ['ManageChannels'],
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Get the server config
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

			// Create a ticket
			const msg = await reopenTicket(client, srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { client.error(err, interaction, true); }
	},
};