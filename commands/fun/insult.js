const insults = require('../../lang/en/insults.json');
module.exports = {
	name: 'insult',
	description: 'Insult someone, or insult yourself!',
	voteOnly: true,
	usage: '[Someone]',
	args: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			// Get user if arg is set
			const user = args[0] ? client.users.cache.find(u => u.id === args[0].replace(/\D/g, '')) : null;

			// Get random index and reply with the string in the array of the index
			const i = Math.floor(Math.random() * insults.length + 1);
			message.reply({ content: `${user ? `${user}, ` : ''}${insults[i]}` });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};