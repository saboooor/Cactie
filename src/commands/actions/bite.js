const action = require('../../functions/action').default;

module.exports = {
	name: 'bite',
	description: 'Bite someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'bite'); }
		catch (err) { error(err, message); }
	},
};