const action = require('../../functions/action.js');

module.exports = {
	name: 'kiss',
	description: 'Kiss someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'kiss', lang); }
		catch (err) { client.error(err, message); }
	},
};