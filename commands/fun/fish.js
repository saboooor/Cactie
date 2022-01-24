const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'fish',
	description: 'fishies swim',
	aliases: ['fishes'],
	async execute(message, args, client) {
		// Get from r/fish with the redditFetch function
		redditFetch(['fish', 'bettafish'], message, client);
	},
};