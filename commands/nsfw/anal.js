module.exports = {
	name: 'anal',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('anal', message, client);
	},
};