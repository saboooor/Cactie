const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'lesbian',
	description: 'r/lesbians, r/Lesbian_gifs, r/LesbiansGIF, r/lesbianporn, r/lesbianasslick, r/lesbianpov, r/lesbianOral',
	async execute(message, args, client) {
		try {
			redditFetch(['lesbians', 'Lesbian_gifs', 'LesbiansGIF', 'lesbianporn', 'lesbianasslick', 'lesbianpov', 'lesbianOral'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};