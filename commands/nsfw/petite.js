const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'petite',
	description: 'r/petite, r/PetiteGoneWild, r/PetiteNSFW, r/PetiteTits, r/xsmallgirls, r/smallgirls',
	async execute(message, args, client) {
		try {
			redditFetch(['petite', 'PetiteGoneWild', 'PetiteNSFW', 'PetiteTits', 'xsmallgirls', 'smallgirls'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};