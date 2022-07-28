const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'cum',
	aliases: ['semen'],
	description: 'r/cum, r/cumsluts, r/cumfetish, r/cumshots, r/cumgifss',
	async execute(message, args, client) {
		try {
			redditFetch(['cum', 'cumsluts', 'cumfetish', 'cumshots', 'cumgifss'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};