module.exports = {
	name: 'nudes',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nudes', message, client);
	},
};