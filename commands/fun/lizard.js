module.exports = {
	name: 'lizard',
	description: 'lizard uhh yes',
	aliases: ['lizards'],
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('lizards', message, client);
	},
};