const action = require('../../functions/action.js');
module.exports = {
	name: 'hug',
	description: 'Hug someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'hug', 'hugs', '🤗');
		}
		catch (err) { client.error(err, message); }
	},
};