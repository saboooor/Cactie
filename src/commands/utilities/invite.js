const commands = require('../../lists/commands').default;

module.exports = {
	name: 'invite',
	description: 'Get Cactie\'s invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		try { commands.get('info').execute(message, args, client); }
		catch (err) { client.error(err, message); }
	},
};