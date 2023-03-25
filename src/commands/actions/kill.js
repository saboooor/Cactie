const action = require('../../functions/action.js');

module.exports = {
	name: 'kill',
	description: 'Kill someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'kill', lang); }
		catch (err) { client.error(err, message); }
	},
};