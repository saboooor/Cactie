module.exports = {
	name: 'futanari',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('futanari', message, client);
	},
};