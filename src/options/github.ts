import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('repo')
      .setDescription('The GitHub Repository')
      .setRequired(true)
      .setAutocomplete(true),
  );
}