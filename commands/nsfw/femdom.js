module.exports = {
	name: 'femdom',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('femdom', message, client);
	},
};