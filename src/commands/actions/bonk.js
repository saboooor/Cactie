const action = require('../../functions/action').default;

module.exports = {
	name: 'bonk',
	description: 'Bonk someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'bonk'); }
		catch (err) { error(err, message); }
	},
};