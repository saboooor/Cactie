module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('goose', message, client);
	},
};