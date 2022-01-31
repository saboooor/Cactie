const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'fish',
	description: 'fishies swim',
	aliases: ['fishes'],
	async execute(message, args, client) {
		try {
			// Get from r/fish with the redditFetch function
			redditFetch(['fish', 'bettafish'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};