module.exports = {
	name: 'hentai',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['hentai', 'hentaifemdom', 'traphentai', 'HENTAI_GIF'], message, client);
	},
};