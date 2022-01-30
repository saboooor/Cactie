const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'dilf',
	async execute(message, args, client) {
		redditFetch(['dilf'], message, client);
	},
};