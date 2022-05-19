const action = require('../../../functions/action.js');
module.exports = {
	name: 'bite',
	description: 'Bite someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try {
			action(message, message.member, args, 'bite', lang);
		}
		catch (err) { client.error(err, message); }
	},
};