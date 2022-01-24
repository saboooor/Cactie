const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'oppai',
	async execute(message, args, client) {
		redditFetch(['oppai', 'oppai_gif'], message, client);
	},
};