const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'thighs',
	async execute(message, args, client) {
		try {
			redditFetch(['Thighs', 'ThickThighs', 'thick', 'thighdeology'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};