module.exports = {
	name: 'yuri',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('yuri', message);
	},
};