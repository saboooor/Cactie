import { SlashCommandUserOption, SlashCommandStringOption, SlashCommandBuilder, SlashCommandBooleanOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addUserOption(
    new SlashCommandUserOption()
      .setName('user')
      .setDescription('The user to punish')
      .setRequired(true),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('reason')
      .setDescription('The reason for punishing the user'),
  ).addBooleanOption(
    new SlashCommandBooleanOption()
      .setName('silent')
      .setDescription('Whether to send a message to the user or not'),
  );
}