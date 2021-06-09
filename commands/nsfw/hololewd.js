module.exports = {
	name: 'hololewd',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('hololewd', message, client);
	},
};