const action = require('../../functions/action').default;

module.exports = {
	name: 'nuzzle',
	description: 'Nuzzle someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'nuzzle'); }
		catch (err) { error(err, message); }
	},
};