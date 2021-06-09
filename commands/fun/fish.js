module.exports = {
	name: 'fish',
	description: 'fishies swim',
	aliases: ['fishes'],
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('fish', message, client);
	},
};