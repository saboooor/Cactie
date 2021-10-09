module.exports = {
	name: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nsfw', message, client);
	},
};