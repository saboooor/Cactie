import { SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('The user to use this command on')
			.setRequired(true),
	);
};