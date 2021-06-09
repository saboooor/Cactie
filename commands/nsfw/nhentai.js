module.exports = {
	name: 'nhentai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('nhentai', message, client);
	},
};