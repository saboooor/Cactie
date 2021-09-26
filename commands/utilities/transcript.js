const { MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'transcript',
	description: 'Get a transcript of the current channel',
	cooldown: 10,
	async execute(message, args, client) {
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Transcript of ${message.channel.name}`)
			.setDescription(`${link}.txt`);
		client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
		message.reply({ embeds: [Embed] })
			.catch(error => { client.logger.error(error); });
	},
};