const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'duck',
	description: 'ducc quack quack',
	aliases: ['ducc', 'ducks'],
	async execute(message, args, client) {
		try {
			// Get from r/duck with the redditFetch function
			redditFetch(['duck'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};