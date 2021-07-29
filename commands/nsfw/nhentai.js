module.exports = {
	name: 'nhentai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('nhentai', message, client);
	},
};