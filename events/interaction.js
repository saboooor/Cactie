module.exports = (client, interaction) => {
	if (interaction.isMessageComponent()) {
		const button = client.buttons.get(interaction.customID);
		if (!button) return;
		try { button.execute(interaction, client); }
		catch (error) { console.error(error); }
	}
};