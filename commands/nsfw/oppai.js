const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'oppai',
	description: 'r/OppaiLove, r/oppai_gif',
	async execute(message, args, client) {
		try {
			redditFetch(['OppaiLove', 'oppai_gif'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};