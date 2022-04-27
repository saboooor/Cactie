const action = require('../../functions/action.js');
module.exports = {
	name: 'mad',
	description: 'Stay mad',
	usage: '<Someone>',
	args: true,
	async execute(message, args, client) {
		try {
			action(message, args, 'mad', 'is mad', 'stay mad 😤😡🤬');
		}
		catch (err) { client.error(err, message); }
	},
};