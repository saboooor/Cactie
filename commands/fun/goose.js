module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		// Get from r/goose with the redditFetch function
		require('../../functions/redditFetch.js')('goose', message, client);
	},
};