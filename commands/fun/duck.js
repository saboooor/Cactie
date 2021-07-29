module.exports = {
	name: 'duck',
	description: 'ducc quack quack',
	aliases: ['ducc', 'ducks'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('duck', message, client);
	},
};