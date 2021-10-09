module.exports = {
	name: 'dick',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('dicks', message, client);
	},
};