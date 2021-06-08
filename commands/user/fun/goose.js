module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	cooldown: 10,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('goose', message);
	},
};