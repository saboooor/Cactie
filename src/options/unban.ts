import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('user')
      .setDescription('The user to unban')
      .setRequired(true)
      .setAutocomplete(true),
  );
}