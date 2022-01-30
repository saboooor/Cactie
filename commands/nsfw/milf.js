const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'milf',
	async execute(message, args, client) {
		redditFetch(['milf'], message, client);
	},
};