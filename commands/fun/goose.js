const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		// Get from r/goose with the redditFetch function
		redditFetch(['goose', 'geese', 'untitledgoosegame'], message, client);
	},
};