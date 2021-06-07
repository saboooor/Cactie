module.exports = {
	name: 'anal',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('anal', message);
	},
};