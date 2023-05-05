import { SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addUserOption(
    new SlashCommandUserOption()
      .setName('someone')
      .setDescription('Pick someone or something to use this command on')
      .setRequired(true),
  );
}