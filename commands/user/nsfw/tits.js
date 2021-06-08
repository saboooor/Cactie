module.exports = {
	name: 'tits',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('tits', message, client);
	},
};