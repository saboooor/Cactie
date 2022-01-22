module.exports = {
	name: 'snake',
	description: 'sssnake',
	aliases: ['snakes'],
	async execute(message, args, client) {
		// Get from r/snake with the redditFetch function
		require('../../functions/redditFetch.js')(['snake', 'Sneks'], message, client);
	},
};