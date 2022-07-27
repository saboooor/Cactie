const { schedule } = require('node-cron');
const closeTicket = require('../../functions/tickets/closeTicket.js');
module.exports = client => {
	schedule('0 0 * * *', async () => {
		// Get all tickets
		const ticketData = await client.query('SELECT * FROM ticketdata');
		ticketData.forEach(async data => {
			if (data.resolved == 'true') {
				// Fetch the guild and channel and config
				const guild = await client.guilds.cache.get(data.guildId);
				const channel = await guild.channels.cache.get(data.channelId);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);

				// Close the ticket
				await closeTicket(client, srvconfig, guild.members.me, channel);
			}
		});
	});
};