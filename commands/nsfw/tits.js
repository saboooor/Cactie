module.exports = {
	name: 'tits',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('tits', message, client);
	},
};