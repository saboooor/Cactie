const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'wallpaper',
	description: 'Get a fresh new wallpaper!',
	async execute(message, args, client) {
		try { redditFetch(['wallpaper', 'wallpapers', 'wallpaperdump'], message, client); }
		catch (err) { client.error(err, message); }
	},
};