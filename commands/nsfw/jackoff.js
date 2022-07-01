const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'jackoff',
	aliases: ['stroke', 'stroking'],
	description: 'r/MenMasturbating, r/strokeyourcock r/jacking',
	async execute(message, args, client) {
		try {
			redditFetch(['MenMasturbating', 'strokeyourcock', 'jacking'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};