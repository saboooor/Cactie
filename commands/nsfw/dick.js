const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'dick',
	async execute(message, args, client) {
		redditFetch(['dicks', 'DickPics4Freedom', 'penis', 'ThickDick'], message, client);
	},
};