module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('goose', message, client);
	},
};