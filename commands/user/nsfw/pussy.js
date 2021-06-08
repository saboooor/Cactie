module.exports = {
	name: 'pussy',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('pussy', message, client);
	},
};