const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'redpanda',
	description: 'cute red pandas ya woo',
	aliases: ['redpandas'],
	async execute(message, args, client) {
		try { redditFetch(['redpandas'], message, client); }
		catch (err) { client.error(err, message); }
	},
};