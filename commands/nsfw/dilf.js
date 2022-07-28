const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'dilf',
	aliases: ['daddy', 'dilfs'],
	description: 'r/dilf, r/DILFs',
	async execute(message, args, client) {
		try {
			redditFetch(['dilf', 'DILFs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};