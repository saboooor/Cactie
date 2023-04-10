import { SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('create')
      .setDescription('Create a poll')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('question')
          .setDescription('The question to ask')
          .setRequired(true),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('end')
      .setDescription('End a poll')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('messageid')
          .setDescription('The Id of the suggestion message')
          .setRequired(true),
      ),
  );
}