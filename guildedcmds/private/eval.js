module.exports = {
	name: 'eval',
	description: 'Runs code specified in args',
	aliases: ['ec'],
	args: true,
	usage: '<Code>',
	cooldown: 0.1,
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if (message.createdById !== 'AYzRpEe4') return client.error('You can\'t do that!', message, true);
		try {
			const code = args.join(' ');
			let evaled = eval(code);
			if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
			message.send({ content: evaled });
		}
		catch (err) { client.error(err, message, true); }
	},
};