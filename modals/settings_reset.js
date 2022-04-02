module.exports = {
	name: 'settings_reset',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Delete settings database for guild and reply
			client.delData('settings', 'guildId', interaction.guild.id);
			interaction.reply({ content: '**Settings successfully reset!**' });
		}
		catch (err) { client.error(err, interaction); }
	},
};