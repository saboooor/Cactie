const Enmap = require('enmap');
module.exports = client => {
	client.tickets = new Enmap({
		name: 'tickets',
		autoFetch: true,
		fetchAll: false,
	});
	client.logger.info('Ticket database loaded');
};