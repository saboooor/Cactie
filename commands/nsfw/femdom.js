module.exports = {
	name: 'femdom',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['femdom', 'FemdomHumiliation', 'femdomgonewild'], message, client);
	},
};