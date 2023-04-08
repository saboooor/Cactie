const action = require('../../functions/action').default;

module.exports = {
	name: 'awooga',
	description: 'AWOOGAA!',
	usage: '[Someone]',
	options: require('../../options/someone').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'awooga'); }
		catch (err) { error(err, message); }
	},
};