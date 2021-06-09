module.exports = {
	name: 'lesbian',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('lesbians', message, client);
	},
};