module.exports = {
	name: 'kitty',
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		// Get from r/kitty with the redditFetch function
		require('../../functions/redditFetch.js')(['kitty', 'cat', 'blurrypicturesofcats'], message, client);
	},
};