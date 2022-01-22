module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['wallpaper', 'wallpapers', 'wallpaperdump'], message, client);
	},
};