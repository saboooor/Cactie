module.exports = {
	name: 'dick',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('dicks', message, client);
	},
};