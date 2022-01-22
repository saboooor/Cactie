module.exports = {
	name: 'lizard',
	description: 'lizard uhh yes',
	aliases: ['lizards'],
	async execute(message, args, client) {
		// Get from r/lizards with the redditFetch function
		require('../../functions/redditFetch.js')(['lizards', 'BeardedDragons'], message, client);
	},
};