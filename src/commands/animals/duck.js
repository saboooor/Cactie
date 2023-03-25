const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'duck',
	description: 'ducc quack quack',
	aliases: ['ducc', 'ducks'],
	async execute(message, args, client) {
		try { redditFetch(['duck'], message, client); }
		catch (err) { client.error(err, message); }
	},
};