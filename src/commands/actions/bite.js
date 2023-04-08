const action = require('../../functions/action').default;

module.exports = {
	name: 'bite',
	description: 'Bite someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'bite'); }
		catch (err) { error(err, message); }
	},
};