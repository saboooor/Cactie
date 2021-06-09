module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	async execute(message, args, client) {
		require('../private/redditfetch_noslash.js')('wallpaper', message, client);
	},
};