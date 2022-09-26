const { schedule } = require('node-cron');
const closeTicket = require('../../functions/tickets/closeTicket.js');

module.exports = client => {
	schedule('0 0 * * *', async () => {
		// Get all tickets
		const allTicketData = await client.getData('reactionroles', null, { all: true });
		allTicketData.forEach(async ticketData => {
			if (ticketData.resolved == 'true') {
				// Fetch the guild and channel and config
				const guild = await client.guilds.cache.get(ticketData.guildId);
				const channel = await guild.channels.cache.get(ticketData.channelId);
				const srvconfig = await client.getData('settings', { guildId: guild.id });

				// Close the ticket
				await closeTicket(client, srvconfig, guild.members.me, channel);
			}
		});
	});
};