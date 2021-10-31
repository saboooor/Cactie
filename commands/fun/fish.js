module.exports = {
	name: 'fish',
	description: 'fishies swim',
	aliases: ['fishes'],
	async execute(message, args, client) {
		// Get from r/fish with the redditFetch function
		require('../../functions/redditFetch.js')('fish', message, client);
	},
};