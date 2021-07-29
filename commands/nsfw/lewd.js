module.exports = {
	name: 'lewd',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('lewd', message, client);
	},
};