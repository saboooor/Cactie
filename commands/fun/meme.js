module.exports = {
	name: 'meme',
	description: 'memes haha funny',
	aliases: ['memes'],
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('memes', message, client);
	},
};