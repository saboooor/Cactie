const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'fish',
	description: 'fishies swim',
	aliases: ['fishes'],
	async execute(message, args, client) {
		try { redditFetch(['fish', 'bettafish'], message, client); }
		catch (err) { client.error(err, message); }
	},
};