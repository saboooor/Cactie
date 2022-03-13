const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'close_subticket',
	botperm: 'ManageThreads',
	async execute(interaction, client) {
		try {
			// Fetch messages in the channel and get the transcript link
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);

			// Create Embed for close message in main ticket
			const CloseEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${interaction.channel.name}`)
				.addFields({ name: '**Transcript**', value: `${link}.txt` })
				.addFields({ name:'**Closed by**', value: `${interaction.user}` });
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
			interaction.channel.parent.send({ embeds: [CloseEmbed] });

			// Delete thread
			client.logger.info(`Closed subticket #${interaction.channel.name}`);
			await interaction.channel.delete();
		}
		catch (err) { client.error(err, interaction); }
	},
};