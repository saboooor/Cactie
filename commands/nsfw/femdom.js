const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'femdom',
	async execute(message, args, client) {
		redditFetch(['femdom', 'FemdomHumiliation', 'femdomgonewild', 'Pegging', 'femdom_gifs'], message, client);
	},
};