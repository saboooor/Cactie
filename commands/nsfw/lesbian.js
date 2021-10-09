module.exports = {
	name: 'lesbian',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('lesbians', message, client);
	},
};