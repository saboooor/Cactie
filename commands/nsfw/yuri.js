module.exports = {
	name: 'yuri',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('yuri', message, client);
	},
};