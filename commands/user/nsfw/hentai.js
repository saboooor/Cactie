module.exports = {
	name: 'hentai',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('hentai', message, client);
	},
};