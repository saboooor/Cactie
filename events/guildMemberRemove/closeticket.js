const closeTicket = require('../../functions/tickets/closeTicket.js');
module.exports = async (client, member) => {
	try {
		// Get the server config
		const srvconfig = await client.getData('settings', 'guildId', member.guild.id);

		// Get the ticket data
		const ticketData = await client.query(`SELECT * FROM ticketdata WHERE opener = '${member.id}'`);
		if (!ticketData.length) return;

		// Close all tickets under member
		ticketData.forEach(async data => {
			// Fetch the channel
			const channel = member.guild.channels.cache.get(data.channelId);

			// Close the ticket
			await closeTicket(client, srvconfig, member, channel);
		});
	}
	catch (err) { logger.error(err); }
};