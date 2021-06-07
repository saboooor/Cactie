module.exports = {
	name: 'futanari',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('futanari', message);
	},
};