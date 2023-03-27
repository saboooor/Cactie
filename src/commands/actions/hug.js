const action = require('../../functions/action').default;

module.exports = {
	name: 'hug',
	description: 'Hug someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'hug'); }
		catch (err) { error(err, message); }
	},
};