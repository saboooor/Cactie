const getTranscript = require('../../../functions/getTranscript.js');
module.exports = {
	name: 'transcript',
	description: 'GetTranscript',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if ((client.type.name == 'guilded' && message.createdById !== 'AYzRpEe4') || message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
		const messages = client.type.name == 'guilded' ? await client.messages.fetchMany(message.channelId) : await message.channel.messages.fetch();
		const url = await getTranscript[client.type.name](messages);
		message.reply(url);
	},
};