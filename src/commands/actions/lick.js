const action = require('../../functions/action').default;

module.exports = {
	name: 'lick',
	description: 'Lick someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'lick'); }
		catch (err) { error(err, message); }
	},
};