module.exports = {
	name: 'tits',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('tits', message, client);
	},
};