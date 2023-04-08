import { SlashCommandUserOption, SlashCommandNumberOption, SlashCommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addUserOption(
		new SlashCommandUserOption()
			.setName('user')
			.setDescription('The user to play 21 Questions with')
			.setRequired(true),
	).addNumberOption(
		new SlashCommandNumberOption()
			.setName('amount')
			.setDescription('The amount of questions (Default is 21)')
			.setMinValue(1)
			.setMaxValue(25),
	);
};