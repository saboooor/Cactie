module.exports = {
	name: 'anal',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('anal', message, client);
	},
};