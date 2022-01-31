const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'hentai',
	async execute(message, args, client) {
		try {
			redditFetch(['hentai', 'hentaifemdom', 'traphentai', 'HENTAI_GIF'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};