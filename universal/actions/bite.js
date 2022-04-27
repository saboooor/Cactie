const action = require('../../../functions/action.js');
module.exports = {
	name: 'bite',
	description: 'Bite someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'bite', 'bites', 'you taste good 👁️👅👁️');
		}
		catch (err) { client.error(err, message); }
	},
};