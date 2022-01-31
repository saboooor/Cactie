const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'kitty',
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		try {
			// Get from r/kitty with the redditFetch function
			redditFetch(['kitty', 'cat', 'blurrypicturesofcats'], message, client);
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};