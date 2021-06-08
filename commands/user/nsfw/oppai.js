module.exports = {
	name: 'oppai',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('oppai', message, client);
	},
};