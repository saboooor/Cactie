const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'tits',
	async execute(message, args, client) {
		try {
			redditFetch(['tits', 'TittyDrop', 'tit', 'boobs'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};