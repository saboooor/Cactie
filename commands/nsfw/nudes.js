const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'nudes',
	async execute(message, args, client) {
		try {
			redditFetch(['nudes', 'PetiteGoneWild', 'RealGirls', 'Nude_Selfie', 'gonewild'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};