module.exports = {
	name: 'hololewd',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('hololewd', message, client);
	},
};