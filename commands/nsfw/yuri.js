module.exports = {
	name: 'yuri',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['yuri', 'yurigif'], message, client);
	},
};