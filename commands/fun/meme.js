module.exports = {
	name: 'meme',
	description: 'memes haha funny',
	aliases: ['memes'],
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('memes', message, client);
	},
};