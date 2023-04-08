const action = require('../../functions/action').default;

module.exports = {
	name: 'hug',
	description: 'Hug someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'hug'); }
		catch (err) { error(err, message); }
	},
};