const action = require('../../../functions/action.js');
module.exports = {
	name: 'stare',
	description: 'Stare at someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'stare', 'stares at', '🧍🏽');
		}
		catch (err) { client.error(err, message); }
	},
};