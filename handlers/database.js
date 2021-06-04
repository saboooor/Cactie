const Enmap = require('enmap');
const { prefix } = require('../config/bot.json');
module.exports = client => {
	client.settings = new Enmap({
		name: 'settings',
		autoFetch: true,
		fetchAll: false,
		cloneLevel: 'deep',
		autoEnsure: {
			prefix: prefix,
			simpreaction: 'true',
			leavemessage: 'false',
			joinmessage: 'false',
			adfree: 'false',
			maxppsize: '35',
			tickets: 'true',
			bonercmd: 'true',
			suggestionchannel: 'default',
			pollchannel: 'default',
			ticketlogchannel: 'false',
			ticketcategory: 'false',
			ticketmention: 'true',
			supportrole: 'Not Set',
		},
	});
	client.logger.log('info', 'Settings database loaded!');
	client.tickets = new Enmap({
		name: 'tickets',
		autoFetch: true,
		fetchAll: false,
		autoEnsure: {
			opener: null,
			resolved: 'false',
			users: [],
		},
	});
	client.logger.log('info', 'Ticket database loaded!');
};