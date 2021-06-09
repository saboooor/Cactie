module.exports = {
	name: 'femdom',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('femdom', message, client);
	},
};