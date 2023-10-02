import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('question')
      .setDescription('The question to ask')
      .setRequired(true)
      .setMaxLength(253),
  );
}