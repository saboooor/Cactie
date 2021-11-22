module.exports = client => {
	client.getTicketData = async function getTicketData(args) {
		let ticketData = await client.query(`SELECT * FROM ticketdata WHERE channelId = ${args}`);
		if(!ticketData[0]) {
			client.logger.info(`Generated ticket data for ${client.channels.cache.get(args).name}!`);
			client.setTicketData(args);
			ticketData = await client.query(`SELECT * FROM ticketdata WHERE channelId = ${args}`);
		}
		return ticketData[0];
	};
};