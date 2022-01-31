const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'milf',
	async execute(message, args, client) {
		try {
			redditFetch(['milf'], message, client);
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};