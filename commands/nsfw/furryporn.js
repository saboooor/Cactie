module.exports = {
	name: 'furryporn',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['furryporn', 'FurryPornSubreddit', 'yiff'], message, client);
	},
};