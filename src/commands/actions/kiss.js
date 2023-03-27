const action = require('../../functions/action').default;

module.exports = {
	name: 'kiss',
	description: 'Kiss someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'kiss'); }
		catch (err) { error(err, message); }
	},
};