module.exports = {
	name: 'nsfw',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nsfw', message, client);
	},
};