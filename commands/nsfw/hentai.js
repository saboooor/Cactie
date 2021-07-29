module.exports = {
	name: 'hentai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('hentai', message, client);
	},
};