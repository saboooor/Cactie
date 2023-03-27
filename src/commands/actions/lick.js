const action = require('../../functions/action').default;

module.exports = {
	name: 'lick',
	description: 'Lick someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'lick'); }
		catch (err) { error(err, message); }
	},
};