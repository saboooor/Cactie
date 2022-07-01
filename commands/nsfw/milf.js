const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'milf',
	aliases: ['mommmy'],
	description: 'r/milf, r/Milfie, r/MILFs, r/milfcumsluts, r/MilfPornX',
	async execute(message, args, client) {
		try {
			redditFetch(['milf', 'Milfie', 'MILFs', 'milfcumsluts', 'MilfPornX'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};