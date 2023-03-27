const action = require('../../functions/action').default;

module.exports = {
	name: 'stare',
	description: 'Stare at someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'stare'); }
		catch (err) { error(err, message); }
	},
};