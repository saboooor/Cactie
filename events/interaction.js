module.exports = (client, interaction) => {
	if (!interaction.isMessageComponent()) return;
	const command = client.buttons.get(interaction.customID);
	try {
		command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
	}
};