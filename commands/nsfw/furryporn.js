const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'furryporn',
	description: 'r/furryporn, r/FurryPornSubreddit, r/yiff, r/FurryOnHuman, r/FurryFuta',
	async execute(message, args, client) {
		try {
			redditFetch(['furryporn', 'FurryPornSubreddit', 'yiff', 'FurryOnHuman', 'FurryFuta'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};