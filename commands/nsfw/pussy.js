module.exports = {
	name: 'pussy',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('pussy', message, client);
	},
};