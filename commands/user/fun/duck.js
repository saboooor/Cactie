module.exports = {
	name: 'duck',
	description: 'ducc quack quack',
	aliases: ['ducc', 'ducks'],
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('duck', message, client);
	},
};