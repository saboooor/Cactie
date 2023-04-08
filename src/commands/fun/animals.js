const commands = require('../../lists/commands').default;

module.exports = {
	name: 'animal',
	description: 'Show a picture of an animal!',
	args: true,
	usage: '<Animal name (in /help animals)>',
	options: require('../../options/animals').default,
	execute(message, args, client) {
		try { commands.get(args[0]).execute(message, args, client); }
		catch (err) { error(err, message); }
	},
};