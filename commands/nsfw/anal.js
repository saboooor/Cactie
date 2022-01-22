module.exports = {
	name: 'anal',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['anal', 'AnalGW'], message, client);
	},
};