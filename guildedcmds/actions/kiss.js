const action = require('../../functions/action.js');
module.exports = {
	name: 'kiss',
	description: 'Kiss someone!',
	usage: '<Someone>',
	args: true,
	async execute(message, args, client) {
		try {
			action(message, args, 'kiss', 'kisses', 'mwah 😚');
		}
		catch (err) { client.error(err, message); }
	},
};