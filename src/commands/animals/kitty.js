const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'kitty',
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		try { redditFetch(['kitty', 'cat', 'blurrypicturesofcats'], message, client); }
		catch (err) { error(err, message); }
	},
};