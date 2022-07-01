const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'yuri',
	description: 'r/yuri, r/yurigif',
	async execute(message, args, client) {
		try {
			redditFetch(['yuri', 'yurigif'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};