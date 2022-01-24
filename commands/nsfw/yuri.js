const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'yuri',
	async execute(message, args, client) {
		redditFetch(['yuri', 'yurigif'], message, client);
	},
};