module.exports = {
	name: 'lewd',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('lewd', message, client);
	},
};