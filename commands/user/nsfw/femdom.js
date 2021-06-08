module.exports = {
	name: 'femdom',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('femdom', message, client);
	},
};