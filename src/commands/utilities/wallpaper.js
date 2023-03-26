const redditFetch = require('../../functions/redditFetch').default;

module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	async execute(message, args, client) {
		try { redditFetch(['wallpaper', 'wallpapers', 'wallpaperdump'], message, client); }
		catch (err) { error(err, message); }
	},
};