const { Embed } = require('guilded.js');
module.exports = {
	name: 'react',
	description: 'Adds a reaction to a message',
	args: true,
	usage: '<Message Link / Id (only in channel)> <Emoji>',
	async execute(message, args, client) {
		try {
			const Embed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Reacted to message!');
			const messagelink = args[0].split('/');
			if (!messagelink[7]) messagelink[7] = message.channelId;
			if (!messagelink[8]) messagelink[8] = args[0];
			await client.messages.addReaction(messagelink[7], messagelink[8], args[1]);
			message.reply({ embeds: [ReactEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};