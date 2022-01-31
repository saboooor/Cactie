const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'yuri',
	async execute(message, args, client) {
		try {
			redditFetch(['yuri', 'yurigif'], message, client);
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};