module.exports = {
	name: 'lesbian',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('lesbians', message, client);
	},
};