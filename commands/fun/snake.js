const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'snake',
	description: 'sssnake',
	aliases: ['snakes'],
	async execute(message, args, client) {
		// Get from r/snake with the redditFetch function
		redditFetch(['snake', 'Sneks'], message, client);
	},
};