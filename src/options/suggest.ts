import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('suggestion')
			.setDescription('What you want to suggest')
			.setRequired(true),
	);
};