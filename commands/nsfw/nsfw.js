module.exports = {
	name: 'nsfw',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nsfw', message, client);
	},
};