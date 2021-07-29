module.exports = {
	name: 'oppai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')('oppai', message, client);
	},
};