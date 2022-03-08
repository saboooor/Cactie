const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'monkey',
	description: '*monke noises*',
	aliases: ['monke', 'monkeys'],
	async execute(message, args, client) {
		try {
			// Get from r/monkeys with the redditFetch function
			redditFetch(['monkeys'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};