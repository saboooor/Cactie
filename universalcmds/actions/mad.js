const action = require('../../functions/action.js');
module.exports = {
	name: 'mad',
	description: 'Stay mad',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'mad', 'is mad', 'stay mad 😤😡🤬');
		}
		catch (err) { client.error(err, message); }
	},
};