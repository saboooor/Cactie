const { MessageAttachment } = require('discord.js');

module.exports = async (client, message) => {
	// If channel is DM,send the dm to the dms channel
	if (!message.channel.isDMBased()) return;
	const files = [];
	for (const attachment of message.attachments) {
		const response = await fetch(attachment[1].url, { method: 'GET' });
		const arrayBuffer = await response.arrayBuffer();
		const img = new MessageAttachment(Buffer.from(arrayBuffer), attachment[1].name);
		files.push(img);
	}
	if (message.author.id == client.user.id) message.author = `${client.user} > <@${message.channel.recipientId}>`;
	client.guilds.cache.get('811354612547190794').channels.cache.get('849453797809455125').send({ content: `**${message.author}** > ${message.content}`, files, embeds: message.embeds, components: message.components });
};