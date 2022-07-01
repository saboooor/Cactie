const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'meme',
	description: 'memes haha funny',
	aliases: ['memes'],
	async execute(message, args, client) {
		try {
			// Get from r/memes with the redditFetch function
			redditFetch(['memes', 'meme', 'dankmemes', 'funny'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};