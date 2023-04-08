const action = require('../../functions/action').default;

module.exports = {
	name: 'giggle',
	description: 'hehehehehehehe',
	usage: '[Someone]',
	options: require('../../options/someone').default,
	async execute(message, args) {
		try { action(message, message.member, args, 'giggle'); }
		catch (err) { error(err, message); }
	},
};