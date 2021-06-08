module.exports = {
	name: 'femdom',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('femdom', message, client);
	},
};