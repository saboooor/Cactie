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
			ticketlogchannel: 'false',
			ticketcategory: 'false',
			ticketmention: 'true',
			supportrole: 'Not Set',
		},
	});
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
};