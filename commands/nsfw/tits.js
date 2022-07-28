const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'tits',
	aliases: ['boob', 'boobs', 'boobies', 'tiddies', 'titty'],
	description: 'r/tits, r/TittyDrop, r/tit, r/boobs, r/titsonastick, r/BustyPetite, r/tittyfuck, r/BigBoobsGW, r/PetiteTits',
	async execute(message, args, client) {
		try {
			redditFetch(['tits', 'TittyDrop', 'boobs', 'titsonastick', 'BustyPetite', 'tittyfuck', 'BigBoobsGW', 'PetiteTits'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};