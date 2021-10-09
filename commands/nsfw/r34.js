module.exports = {
	name: 'r34',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('rule34', message, client);
	},
};