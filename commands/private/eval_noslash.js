function clean(text) {
	if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
	else { return text; }
}
module.exports = {
	name: 'eval',
	description: 'Execute any code',
	aliases: ['ec'],
	args: true,
	usage: '<Code>',
	async execute(message, args) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		try {
			const code = args.join(' ');
			let evaled = eval(code);
			if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled); }
			message.channel.send({ content: clean(evaled), code: 'xl' });
		}
		catch (err) {
			message.channel.send({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` });
		}
	},
};