import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('url')
      .setDescription('The link to the message to add the reaction to')
      .setRequired(true),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('emoji')
      .setDescription('The emoji to react with')
      .setRequired(true),
  );
}