const { MessageEmbed } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'close_subticket',
	botperms: 'MANAGE_THREADS',
	async execute(interaction, client) {
		interaction.deferUpdate();
		// Fetch messages in the channel and get the transcript link
		const messages = await interaction.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);

		// Create Embed for close message in main ticket
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${interaction.channel.name}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${interaction.user}`);
		client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		interaction.channel.parent.send({ embeds: [Embed] });

		// Delete thread
		client.logger.info(`Closed subticket #${interaction.channel.name}`);
		await interaction.channel.delete();
	},
};