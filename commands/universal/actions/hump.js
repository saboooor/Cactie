const action = require('../../../functions/action.js');
module.exports = {
	name: 'hump',
	description: 'Hump someone??',
	usage: '[Someone]',
	options: require('../../options/someone.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'hump', 'humps', 'humping?? 👀');
		}
		catch (err) { client.error(err, message); }
	},
};