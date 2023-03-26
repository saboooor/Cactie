const action = require('../../functions/action').default;

module.exports = {
	name: 'giggle',
	description: 'hehehehehehehe',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'giggle', lang); }
		catch (err) { error(err, message); }
	},
};