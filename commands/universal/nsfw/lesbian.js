const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'lesbian',
	async execute(message, args, client) {
		try {
			redditFetch(['lesbians', 'Lesbian_gifs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};