const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'lewd',
	async execute(message, args, client) {
		try {
			redditFetch(['lewd', 'hololewd'], message, client);
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};