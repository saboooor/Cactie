const action = require('../../functions/action.js');
module.exports = {
	name: 'nuzzle',
	description: 'Nuzzle someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'nuzzle', 'nuzzles', '🤗');
		}
		catch (err) { client.error(err, message); }
	},
};