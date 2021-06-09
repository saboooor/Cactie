module.exports = {
	name: 'dick',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('dicks', message, client);
	},
};