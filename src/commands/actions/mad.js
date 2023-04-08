const action = require('../../functions/action').default;

module.exports = {
	name: 'mad',
	description: 'Stay mad',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'mad'); }
		catch (err) { error(err, message); }
	},
};