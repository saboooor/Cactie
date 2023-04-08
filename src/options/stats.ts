import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('ip')
			.setDescription('Enter a Minecraft server address')
			.setRequired(true),
	);
};