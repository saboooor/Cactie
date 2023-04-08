import { SlashCommandSubcommandBuilder, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'fs';

export default async function options(cmd: SlashCommandBuilder) {
	const commands = readdirSync('./src/commands/animals');
	commands.forEach(commandName => {
		cmd.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName(commandName.replace('.js', ''))
				.setDescription(require(`../commands/animals/${commandName}`).description),
		);
	});
};