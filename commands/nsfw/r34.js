module.exports = {
	name: 'r34',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('rule34', message, client);
	},
};