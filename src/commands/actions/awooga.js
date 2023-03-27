const action = require('../../functions/action').default;

module.exports = {
	name: 'awooga',
	description: 'AWOOGAA!',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'awooga'); }
		catch (err) { error(err, message); }
	},
};