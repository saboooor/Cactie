import { SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandRoleOption, SlashCommandNumberOption, SlashCommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
	cmd.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('get')
			.setDescription('Show all reaction roles'),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('add')
			.setDescription('Add a reaction role')
			.addStringOption(
				new SlashCommandStringOption()
					.setName('emoji')
					.setDescription('The reaction\'s emoji')
					.setRequired(true),
			).addStringOption(
				new SlashCommandStringOption()
					.setName('url')
					.setDescription('The link to the message to add the reaction to')
					.setRequired(true),
			).addRoleOption(
				new SlashCommandRoleOption()
					.setName('role')
					.setDescription('The role to remove/add the user to')
					.setRequired(true),
			).addStringOption(
				new SlashCommandStringOption()
					.setName('type')
					.setDescription('The reaction type')
					.setRequired(true)
					.setChoices(
						{ name: 'Toggle', value: 'toggle' },
						{ name: 'Switch', value: 'switch' },
					),
			),
	).addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('remove')
			.setDescription('Remove a reaction role')
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName('id')
					.setDescription('The reaction role\'s ID')
					.setRequired(true),
			),
	);
};