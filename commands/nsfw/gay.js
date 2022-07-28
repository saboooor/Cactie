const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'gay',
	description: 'r/gaynsfw, r/GayGifs, r/gayporn, r/Gaypornclub, r/GayPornGIFs4Ya, r/GayAnalGoneWild',
	async execute(message, args, client) {
		try {
			redditFetch(['gaynsfw', 'GayGifs', 'gayporn', 'Gaypornclub', 'GayPornGIFs4Ya', 'GayAnalGoneWild'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};