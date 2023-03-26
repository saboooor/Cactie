const action = require('../../functions/action').default;

module.exports = {
	name: 'awooga',
	description: 'AWOOGAA!',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'awooga', lang); }
		catch (err) { error(err, message); }
	},
};