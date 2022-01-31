const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'oppai',
	async execute(message, args, client) {
		try {
			redditFetch(['oppai', 'oppai_gif'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};