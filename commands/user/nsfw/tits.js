module.exports = {
	name: 'tits',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('tits', message);
	},
};