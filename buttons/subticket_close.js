const Discord = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'close_subticket',
	async execute(interaction, client) {
		const messages = await interaction.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${interaction.channel.name}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${interaction.user}`);
		client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		interaction.channel.parent.send({ embeds: [Embed] })
			.catch(error => { client.logger.error(error); });
		client.logger.info(`Closed subticket #${interaction.channel.name}`);
		await interaction.channel.delete();
	},
};