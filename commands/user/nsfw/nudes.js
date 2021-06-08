module.exports = {
	name: 'nudes',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nudes', message, client);
	},
};