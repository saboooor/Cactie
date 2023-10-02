import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('create')
      .setDescription('Create a suggestion')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('suggestion')
          .setDescription('The suggestion you want to make')
          .setRequired(true)
          .setMaxLength(1024),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('approve')
      .setDescription('Approve a suggestion')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('messageid')
          .setDescription('The Id of the suggestion message')
          .setRequired(true)
          .setAutocomplete(true),
      ).addStringOption(
        new SlashCommandStringOption()
          .setName('response')
          .setDescription('Response to the suggestion')
          .setMaxLength(1024),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('deny')
      .setDescription('Deny a suggestion')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('messageid')
          .setDescription('The Id of the suggestion message')
          .setRequired(true)
          .setAutocomplete(true),
      ).addStringOption(
        new SlashCommandStringOption()
          .setName('response')
          .setDescription('Response to the suggestion')
          .setMaxLength(1024),
      ),
  );
}