const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'lesbian',
	async execute(message, args, client) {
		redditFetch(['lesbians', 'Lesbian_gifs'], message, client);
	},
};