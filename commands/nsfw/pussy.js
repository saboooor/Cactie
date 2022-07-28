const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'pussy',
	aliases: ['vagina', 'pussies', 'fingering', 'vaginas'],
	description: 'r/pussy, r/FingeringHerself, r/shavedpussies, r/GodPussy, r/Fingering, r/FingeringFever, r/PussyFlashing',
	async execute(message, args, client) {
		try {
			redditFetch(['pussy', 'FingeringHerself', 'shavedpussies', 'GodPussy', 'Fingering', 'FingeringFever', 'PussyFlashing'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};
