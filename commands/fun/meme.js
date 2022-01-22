module.exports = {
	name: 'meme',
	description: 'memes haha funny',
	aliases: ['memes'],
	async execute(message, args, client) {
		// Get from r/memes with the redditFetch function
		require('../../functions/redditFetch.js')(['memes', 'meme', 'dankmemes', 'funny'], message, client);
	},
};