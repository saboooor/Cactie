const Enmap = require('enmap');
module.exports = client => {
	client.tickets = new Enmap({
		name: 'tickets',
		autoFetch: true,
		fetchAll: false,
	});
	client.logger.info('Ticket database loaded');
	client.memberdata = new Enmap({
		name: 'memberdata',
		autoFetch: true,
		fetchAll: true,
		autoEnsure: {
			mutedUntil: 0,
			bannedUntil: 0,
		},
	});
	client.logger.info('Ban/Mute database loaded');
};