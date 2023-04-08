import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('someone')
			.setDescription('Pick someone or something to use this command on'),
	);
};