module.exports = {
	name: 'femdom',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['femdom', 'FemdomHumiliation', 'femdomgonewild', 'Pegging', 'femdom_gifs'], message, client);
	},
};