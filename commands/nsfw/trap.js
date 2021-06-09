module.exports = {
	name: 'trap',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('traps', message, client);
	},
};