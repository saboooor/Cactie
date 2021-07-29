module.exports = {
	name: 'dick',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('dicks', message, client);
	},
};