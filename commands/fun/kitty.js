module.exports = {
	name: 'kitty',
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('kitty', message, client);
	},
};