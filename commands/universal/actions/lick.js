const action = require('../../../functions/action.js');
module.exports = {
	name: 'lick',
	description: 'Lick someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'lick', 'licks', 'you taste good 👁️👅👁️');
		}
		catch (err) { client.error(err, message); }
	},
};