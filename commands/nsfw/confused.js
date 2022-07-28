const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'confused',
	aliases: ['confusedboner'],
	description: 'r/confusedboners',
	async execute(message, args, client) {
		try {
			redditFetch(['confusedboners'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};