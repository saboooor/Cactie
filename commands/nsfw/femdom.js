module.exports = {
	name: 'femdom',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('femdom', message, client);
	},
};