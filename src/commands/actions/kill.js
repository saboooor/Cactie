const action = require('../../functions/action').default;

module.exports = {
	name: 'kill',
	description: 'Kill someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'kill'); }
		catch (err) { error(err, message); }
	},
};