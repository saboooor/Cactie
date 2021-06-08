module.exports = {
	name: 'nhentai',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nhentai', message, client);
	},
};