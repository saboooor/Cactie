const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		try {
			// Get from r/goose with the redditFetch function
			redditFetch(['goose', 'geese'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};