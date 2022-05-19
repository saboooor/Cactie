const action = require('../../../functions/action.js');
module.exports = {
	name: 'hump',
	description: 'Hump someone??',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client, lang) {
		try {
			action(message, message.member, args, 'hump', lang);
		}
		catch (err) { client.error(err, message); }
	},
};