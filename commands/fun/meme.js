module.exports = {
	name: 'meme',
	description: 'memes haha funny',
	aliases: ['memes'],
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('memes', message, client);
	},
};