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
			reactions: 'true',
			leavemessage: 'false',
			joinmessage: 'false',
			adfree: 'false',
			maxppsize: '35',
			tickets: 'buttons',
			bonercmd: 'true',
			suggestionchannel: 'default',
			pollchannel: 'default',
			ticketlogchannel: 'false',
			ticketcategory: 'false',
			ticketmention: 'true',
			supportrole: 'Not Set',
			mutecmd: 'true',
			muterole: 'Not Set',
			adminrole: 'permission',
			msgshortener: '30',
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