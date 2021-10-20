module.exports = {
	name: 'settings_reset',
	permissions: 'ADMINISTRATOR',
	async execute(interaction, client) {
		// Delete settings database for guild and reply
		client.settings.delete(interaction.guild.id);
		interaction.update({ content: 'Settings successfully reset!', components: [] });
	},
};