const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../functions/discord/getTranscript.js');
module.exports = {
	name: 'close_subticket',
	botperm: 'ManageThreads',
	async execute(interaction, client) {
		try {
			// Fetch the messages of the channel and get the transcript
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}`);

			// Create embed and send it to the main ticket channel
			const CloseEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Deleted ${interaction.channel.name}`)
				.addFields([
					{ name: '**Transcript**', value: `${link}` },
					{ name: '**Deleted by**', value: `${interaction.member.user}` },
				]);
			interaction.channel.parent.send({ embeds: [CloseEmbed] }).catch(err => client.logger.error(err.stack));

			// Log and delete the thread
			client.logger.info(`Deleted subticket #${interaction.channel.name}`);
			return interaction.channel.delete();
		}
		catch (err) { client.error(err, interaction); }
	},
};