module.exports = {
	name: 'oppai',
	description: 'nsfw',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('oppai', message, client);
	},
};