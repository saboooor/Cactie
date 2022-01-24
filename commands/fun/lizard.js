const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'lizard',
	description: 'lizard uhh yes',
	aliases: ['lizards'],
	async execute(message, args, client) {
		// Get from r/lizards with the redditFetch function
		redditFetch(['lizards', 'BeardedDragons'], message, client);
	},
};