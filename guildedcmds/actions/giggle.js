const action = require('../../functions/action.js');
module.exports = {
	name: 'giggle',
	description: 'hehehehehehehe',
	usage: '[Someone]',
	async execute(message, args, client) {
		try {
			action(message, args, 'giggle', 'giggles', 'hehehehehehehe');
		}
		catch (err) { client.error(err, message); }
	},
};