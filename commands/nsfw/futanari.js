module.exports = {
	name: 'futanari',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('futanari', message, client);
	},
};