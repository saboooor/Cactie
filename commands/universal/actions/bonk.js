const action = require('../../../functions/action.js');
module.exports = {
	name: 'bonk',
	description: 'Bonk someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'bonk', 'bonks', 'get bonked 🔨');
		}
		catch (err) { client.error(err, message); }
	},
};