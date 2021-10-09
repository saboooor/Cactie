module.exports = {
	name: 'oppai',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('oppai', message, client);
	},
};