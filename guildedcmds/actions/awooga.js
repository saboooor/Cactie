const action = require('../../functions/action.js');
module.exports = {
	name: 'awooga',
	description: 'AWOOGAA!',
	usage: '[Someone]',
	async execute(message, args, client) {
		try {
			action(message, args, 'awooga', 'AWOOGAS', '👀👀');
		}
		catch (err) { client.error(err, message); }
	},
};