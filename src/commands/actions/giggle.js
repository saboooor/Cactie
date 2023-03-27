const action = require('../../functions/action').default;

module.exports = {
	name: 'giggle',
	description: 'hehehehehehehe',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client) {
		try { action(message, message.member, args, 'giggle'); }
		catch (err) { error(err, message); }
	},
};