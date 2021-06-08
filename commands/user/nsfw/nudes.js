module.exports = {
	name: 'nudes',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nudes', message, client);
	},
};