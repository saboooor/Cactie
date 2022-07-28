const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'femdom',
	description: 'r/femdom, r/FemdomHumiliation, r/femdomgonewild, r/Pegging, r/femdom_gifs',
	async execute(message, args, client) {
		try {
			redditFetch(['femdom', 'FemdomHumiliation', 'femdomgonewild', 'Pegging', 'femdom_gifs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};