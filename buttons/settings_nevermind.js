module.exports = {
	name: 'settings_nevermind',
	async execute(interaction, client) {
		try {
			// Delete message and command message
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