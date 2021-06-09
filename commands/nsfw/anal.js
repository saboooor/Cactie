module.exports = {
	name: 'anal',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('anal', message, client);
	},
};