const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'trap',
	aliases: ['traps', 'femboy', 'femboys'],
	description: 'r/traps, r/trapsarentgay, r/FemBoys, r/trapsgonewild, r/trapgifs',
	async execute(message, args, client) {
		try {
			redditFetch(['traps', 'trapsarentgay', 'FemBoys', 'trapsgonewild', 'trapgifs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};