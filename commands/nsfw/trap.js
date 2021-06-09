module.exports = {
	name: 'trap',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('traps', message, client);
	},
};