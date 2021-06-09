module.exports = {
	name: 'yuri',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('yuri', message, client);
	},
};