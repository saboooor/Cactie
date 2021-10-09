module.exports = {
	name: 'hololewd',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('hololewd', message, client);
	},
};