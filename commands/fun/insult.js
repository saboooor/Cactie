const insults = require('../../config/insults.json');
module.exports = {
	name: 'insult',
	description: 'Insult someone, or just insult yourself',
	usage: '[Someone]',
	args: true,
	options: [{
		type: 6,
		name: 'someone',
		description: 'Pick someone to insult, or just insult yourself',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const user = args[0] ? client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', '')) : null;
		const i = Math.floor(Math.random() * insults.length + 1);
		message.reply(`${user ? `${user}, ` : ''}${insults[i]}`);
	},
};