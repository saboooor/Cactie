const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'hentai',
	description: 'r/hentai, r/hentaifemdom, r/traphentai, r/HENTAI_GIF, r/hentaibondage, r/HentaiAnal',
	async execute(message, args, client) {
		try {
			redditFetch(['hentai', 'hentaifemdom', 'traphentai', 'HENTAI_GIF', 'hentaibondage', 'HentaiAnal'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};