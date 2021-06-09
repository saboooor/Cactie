module.exports = {
	name: 'kitty',
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('kitty', message, client);
	},
};