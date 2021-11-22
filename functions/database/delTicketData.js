module.exports = client => {
	client.delTicketData = function delTicketData(args) {
		try {
			client.con.query(`DELETE FROM ticketdata WHERE channelId = ${args}`);
			client.logger.info(`Ticket data deleted for ${client.channels.cache.get(args).name}!`);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error deleting ticket data: ${error}`);
		}
	};
};