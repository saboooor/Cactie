module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('wallpaper', message, client);
	},
};