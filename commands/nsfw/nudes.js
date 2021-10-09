module.exports = {
	name: 'nudes',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nudes', message, client);
	},
};