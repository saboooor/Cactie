module.exports = {
	name: 'lizard',
	description: 'lizard uhh yes',
	aliases: ['lizards'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('lizards', message, client);
	},
};