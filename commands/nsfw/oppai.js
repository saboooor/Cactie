module.exports = {
	name: 'oppai',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['oppai', 'oppai_gif'], message, client);
	},
};