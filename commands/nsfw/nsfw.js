module.exports = {
	name: 'nsfw',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('nsfw', message, client);
	},
};