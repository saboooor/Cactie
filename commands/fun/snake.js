module.exports = {
	name: 'snake',
	description: 'sssnake',
	aliases: ['snakes'],
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('snake', message, client);
	},
};