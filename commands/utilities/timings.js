const analyzeTimings = require('../../functions/timings/analyzeTimings.js');
module.exports = {
	name: 'timings',
	description: 'Analyze Paper timings to optimize the Paper server.',
	cooldown: 10,
	args: true,
	usage: '<Timings Link>',
	options: require('../options/url.json'),
	async execute(message, args, client) {
		try {
			await message.reply(await analyzeTimings(message, client, args));
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};