import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('url')
      .setDescription('The URL')
      .setRequired(true),
  );
}