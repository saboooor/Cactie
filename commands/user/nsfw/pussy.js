module.exports = {
	name: 'pussy',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('pussy', message, client);
	},
};