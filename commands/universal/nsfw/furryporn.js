const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'furryporn',
	async execute(message, args, client) {
		try {
			redditFetch(['furryporn', 'FurryPornSubreddit', 'yiff'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};