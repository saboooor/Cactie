module.exports = {
	name: 'pussy',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('pussy', message, client);
	},
};