const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'lewd',
	async execute(message, args, client) {
		redditFetch(['lewd', 'hololewd'], message, client);
	},
};