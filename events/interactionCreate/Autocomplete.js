const { InteractionType } = require('discord.js');

module.exports = async (client, interaction) => {
	// Check if the interaction is autocomplete
	if (interaction.type != InteractionType.ApplicationCommandAutocomplete) return;

	// Get the command from the available commands in the bot
	const command = client.commands.get(interaction.commandName);
	if (!command || !command.autoComplete) return;

	// if autocomplete is set then execute it
	await command.autoComplete(client, interaction);
};