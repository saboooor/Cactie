const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'panda',
	description: 'cute panda ya woo',
	aliases: ['pandas'],
	async execute(message, args, client) {
		try {
			// Get from r/duck with the redditFetch function
			redditFetch(['panda', 'redpandas'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};