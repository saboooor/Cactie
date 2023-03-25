const action = require('../../functions/action.js');

module.exports = {
	name: 'lick',
	description: 'Lick someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'lick', lang); }
		catch (err) { client.error(err, message); }
	},
};