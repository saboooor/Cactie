const getMessages = require('../../functions/getMessages.js');

module.exports = {
	name: 'getmessages',
	description: 'getMessages',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
		const messagechunks = await getMessages(message.channel, 'infinite');
		let messagesize = 0;
		for (const i in messagechunks) messagesize += messagechunks[i].size;
		message.reply(`${messagechunks.length} chunks (${messagesize} total)`);
	},
};