module.exports = {
	name: 'oppai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('oppai', message, client);
	},
};