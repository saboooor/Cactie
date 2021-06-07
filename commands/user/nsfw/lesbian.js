module.exports = {
	name: 'lesbian',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('lesbians', message);
	},
};