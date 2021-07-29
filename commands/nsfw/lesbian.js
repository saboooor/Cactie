module.exports = {
	name: 'lesbian',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('lesbians', message, client);
	},
};