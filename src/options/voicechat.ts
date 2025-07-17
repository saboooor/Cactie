import { SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandUserOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('create')
      .setDescription('Create a voice chat')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('name')
          .setDescription('The name of the voice chat')
          .setMaxLength(100)
          .setRequired(true),
      ).addNumberOption(
        new SlashCommandNumberOption()
          .setName('limit')
          .setDescription('The user limit of the voice chat')
          .setMaxValue(99)
          .setMinValue(1),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('delete')
      .setDescription('Delete your voice chat'),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('add-user')
      .setDescription('Add a user to your voice chat')
      .addUserOption(
        new SlashCommandUserOption()
          .setName('user')
          .setDescription('The user to add')
          .setRequired(true),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('remove-user')
      .setDescription('Remove a user from your voice chat')
      .addUserOption(
        new SlashCommandUserOption()
          .setName('user')
          .setDescription('The user to remove')
          .setRequired(true),
      ),
  );
}
