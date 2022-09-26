const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'femdom',
	description: 'r/femdom, r/FemdomHumiliation, r/femdomgonewild, r/Pegging',
	async execute(message, args, client) {
		try {
			redditFetch(['femdom', 'FemdomHumiliation', 'femdomgonewild', 'Pegging'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};