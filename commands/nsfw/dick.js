module.exports = {
	name: 'dick',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['dicks', 'DickPics4Freedom', 'penis', 'ThickDick'], message, client);
	},
};