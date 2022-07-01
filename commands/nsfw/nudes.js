const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'nudes',
	aliases: ['nude'],
	description: 'r/nudes, r/PetiteGoneWild, r/RealGirls, r/Nude_Selfie, r/gonewild, r/nudesfeed',
	async execute(message, args, client) {
		try {
			redditFetch(['nudes', 'PetiteGoneWild', 'RealGirls', 'Nude_Selfie', 'gonewild', 'nudesfeed'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};