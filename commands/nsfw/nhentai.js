module.exports = {
	name: 'nhentai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nhentai', message, client);
	},
};