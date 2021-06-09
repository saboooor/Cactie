module.exports = {
	name: 'tits',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('tits', message, client);
	},
};