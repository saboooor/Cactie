module.exports = {
	name: 'anal',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('anal', message, client);
	},
};