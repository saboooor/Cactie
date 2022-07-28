const getTranscript = require('../../functions/getTranscript.js');

module.exports = {
	name: 'transcript',
	description: 'GetTranscript',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if (message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const url = await getTranscript(messages);
		message.reply(url);
	},
};