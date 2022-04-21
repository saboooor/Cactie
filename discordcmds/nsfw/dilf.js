const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'dilf',
	async execute(message, args, client) {
		try {
			redditFetch(['dilf'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};