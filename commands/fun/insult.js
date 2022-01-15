const insults = require('../../config/insults.json');
module.exports = {
	name: 'insult',
	description: 'Insult someone, or insult yourself!',
	voteOnly: true,
	usage: '[Someone]',
	args: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		// Get user if arg is set
		const user = args[0] ? client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', '')) : null;

		// Get random index and reply with the string in the array of the index
		const i = Math.floor(Math.random() * insults.length + 1);
		message.reply(`${user ? `${user}, ` : ''}${insults[i]}`);
	},
};