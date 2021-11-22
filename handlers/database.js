const Enmap = require('enmap');
const { prefix } = require('../config/bot.json');
module.exports = client => {
	client.settings = new Enmap({
		name: 'settings',
		autoFetch: true,
		fetchAll: true,
		cloneLevel: 'deep',
		autoEnsure: {
			prefix: prefix,
			reactions: 'true',
			leavemessage: 'false',
			joinmessage: 'false',
			adfree: 'false',
			maxppsize: '35',
			tickets: 'buttons',
			bonercmd: 'true',
			suggestionchannel: 'false',
			suggestthreads: 'true',
			pollchannel: 'false',
			ticketlogchannel: 'false',
			ticketcategory: 'false',
			ticketmention: 'here',
			supportrole: 'Not Set',
			mutecmd: 'true',
			muterole: 'Not Set',
			adminrole: 'permission',
			msgshortener: '30',
			djrole: 'false',
		},
	});
	client.logger.info('Settings database loaded');
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