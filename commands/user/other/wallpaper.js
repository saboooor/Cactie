module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	cooldown: 10,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('wallpaper', message);
	},
};