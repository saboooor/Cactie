const analyzeTimings = require('../../functions/analyzeTimings.js');
module.exports = {
	name: 'timings',
	description: 'Analyze Paper timings to optimize the Paper server.',
	cooldown: 10,
	args: true,
	usage: '<Timings Link>',
	options: require('../options/url.json'),
	async execute(message, args, client) {
		await message.reply(await analyzeTimings(message, client, args));
	},
};