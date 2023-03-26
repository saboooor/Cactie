const action = require('../../functions/action').default;

module.exports = {
	name: 'nuzzle',
	description: 'Nuzzle someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client, lang) {
		try { action(message, message.member, args, 'nuzzle', lang); }
		catch (err) { error(err, message); }
	},
};