const insults = require('../../config/insults.json');
module.exports = {
	name: 'insult',
	description: 'Insult someone, or insult yourself!',
	usage: '[Someone]',
	args: true,
	options: require('./someone.json'),
	async execute(message, args, client) {
		const user = args[0] ? client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', '')) : null;
		const i = Math.floor(Math.random() * insults.length + 1);
		message.reply(`${user ? `${user}, ` : ''}${insults[i]}`);
	},
};