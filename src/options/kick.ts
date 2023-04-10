import { SlashCommandUserOption, SlashCommandStringOption, SlashCommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addUserOption(
    new SlashCommandUserOption()
      .setName('user')
      .setDescription('The user to kick')
      .setRequired(true),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('reason')
      .setDescription('The reason for kicking the user'),
  );
}