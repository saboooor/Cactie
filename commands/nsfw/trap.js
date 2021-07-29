module.exports = {
	name: 'trap',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('traps', message, client);
	},
};