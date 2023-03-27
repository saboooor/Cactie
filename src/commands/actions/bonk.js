const action = require('../../functions/action').default;

module.exports = {
	name: 'bonk',
	description: 'Bonk someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'bonk'); }
		catch (err) { error(err, message); }
	},
};