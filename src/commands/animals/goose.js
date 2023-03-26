const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'goose',
	description: 'goos honk honk',
	aliases: ['goos', 'geese'],
	async execute(message, args, client) {
		try { redditFetch(['goose', 'geese'], message, client); }
		catch (err) { error(err, message); }
	},
};