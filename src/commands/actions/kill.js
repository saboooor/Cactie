const action = require('../../functions/action').default;

module.exports = {
	name: 'kill',
	description: 'Kill someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'kill'); }
		catch (err) { error(err, message); }
	},
};