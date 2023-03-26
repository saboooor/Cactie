const action = require('../../functions/action.js');

module.exports = {
	name: 'stare',
	description: 'Stare at someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'stare', lang); }
		catch (err) { error(err, message); }
	},
};