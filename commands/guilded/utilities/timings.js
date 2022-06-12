const analyzeTimings = require('../../../functions/timings/analyzeTimings.js');
module.exports = {
	name: 'timings',
	description: 'Analyze Paper timings to optimize the Paper server.',
	cooldown: 10,
	args: true,
	usage: '<Timings Link>',
	options: require('../../options/url.js'),
	async execute(message, args, client) {
		try {
			const timingsresult = await analyzeTimings(message, client, args);
			await message.reply(timingsresult[0]);
		}
		catch (err) { client.error(err, message); }
	},
};