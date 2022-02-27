const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'redpanda',
	description: 'cute red pandas ya woo',
	aliases: ['redpandas'],
	async execute(message, args, client) {
		try {
			// Get from r/redpandas with the redditFetch function
			redditFetch(['redpandas'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};