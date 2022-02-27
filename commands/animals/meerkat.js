const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'meerkat',
	description: 'yes meerkat',
	aliases: ['meerkats'],
	async execute(message, args, client) {
		try {
			// Get from r/duck with the redditFetch function
			redditFetch(['Meerkats', 'redpandas'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};