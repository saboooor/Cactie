import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('messageid')
			.setDescription('The Id of the suggestion message')
			.setRequired(true),
	).addStringOption(
		new SlashCommandStringOption()
			.setName('response')
			.setDescription('Response to the suggestion'),
	);
};
