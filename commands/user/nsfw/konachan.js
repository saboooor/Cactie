module.exports = {
	name: 'konachan',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('konachan', message);
	},
};