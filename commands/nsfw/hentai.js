module.exports = {
	name: 'hentai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('hentai', message, client);
	},
};