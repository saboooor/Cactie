const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'redpanda',
	description: 'cute red pandas ya woo',
	aliases: ['redpandas'],
	async execute(message, args, client) {
		try { redditFetch(['redpandas'], message, client); }
		catch (err) { error(err, message); }
	},
};