const { SlashCommandSubcommandBuilder } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = async function options(cmd) {
	const commands = readdirSync('./commands/animals');
	commands.forEach(commandName => {
		cmd.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName(commandName.replace('.js', ''))
				.setDescription(require(`../commands/animals/${commandName}`).description),
		);
	});
};