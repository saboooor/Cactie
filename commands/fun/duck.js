module.exports = {
	name: 'duck',
	description: 'ducc quack quack',
	aliases: ['ducc', 'ducks'],
	async execute(message, args, client) {
		// Get from r/duck with the redditFetch function
		require('../../functions/redditFetch.js')(['duck'], message, client);
	},
};