module.exports = {
	name: 'snake',
	description: 'sssnake',
	aliases: ['snakes'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('snake', message, client);
	},
};