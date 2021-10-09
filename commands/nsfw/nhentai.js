module.exports = {
	name: 'nhentai',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nhentai', message, client);
	},
};