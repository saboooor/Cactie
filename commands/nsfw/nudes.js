module.exports = {
	name: 'nudes',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['nudes', 'PetiteGoneWild', 'RealGirls', 'Nude_Selfie', 'gonewild'], message, client);
	},
};