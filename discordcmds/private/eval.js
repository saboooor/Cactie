module.exports = {
	name: 'eval',
	description: 'Runs code specified in args',
	aliases: ['ec'],
	args: true,
	usage: '<Code>',
	cooldown: 0.1,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if (message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
		try {
			const code = args.join(' ');
			let evaled = eval(code);
			if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
			message.channel.send({ content: evaled });
		}
		catch (err) {
			message.channel.send({ content: `\`ERROR\` \`\`\`\n${err}\n\`\`\`` });
		}
	},
};