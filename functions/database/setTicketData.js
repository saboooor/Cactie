module.exports = client => {
	client.setTicketData = function setTicketData(args) {
		try {
			client.con.query('INSERT INTO ticketdata (channelId) VALUES (?)', [args]);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error creating ticket data: ${error}`);
		}
	};
};