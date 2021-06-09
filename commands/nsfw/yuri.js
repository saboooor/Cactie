module.exports = {
	name: 'yuri',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('yuri', message, client);
	},
};