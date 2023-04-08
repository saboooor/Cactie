const action = require('../../functions/action').default;

module.exports = {
	name: 'kiss',
	description: 'Kiss someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'kiss'); }
		catch (err) { error(err, message); }
	},
};