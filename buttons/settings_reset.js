function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'settings_reset',
	permission: 'Administrator',
	async execute(interaction, client) {
		try {
			// Delete settings database for guild and reply
			client.delData('settings', 'guildId', interaction.guild.id);
			const SettingsEmbed = interaction.message.embeds[0].setDescription('Settings successfully reset!');
			interaction.reply({ components: [], embeds: [SettingsEmbed] });

			// Delete message after 5 seconds
			await sleep(5000);
			await interaction.message.delete();
			if (interaction.message.reference && interaction.message.reference.messageId) {
				const msgs = await interaction.channel.messages.fetch({ around: interaction.message.reference.messageId, limit: 1 });
				const fetchedMsg = msgs.first();
				fetchedMsg.delete();
			}
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};