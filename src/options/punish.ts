import { SlashCommandUserOption, SlashCommandStringOption, SlashCommandBuilder, SlashCommandBooleanOption } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addUserOption(
    new SlashCommandUserOption()
      .setName('user')
      .setDescription('The user to punish')
      .setRequired(true),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('time')
      .setDescription('Time to temporarily punish until s/m/h/d/mo (Ex. 10s, 2m)'),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('reason')
      .setDescription('The reason for punishing the user')
      .setMaxLength(1024),
  ).addBooleanOption(
    new SlashCommandBooleanOption()
      .setName('silent')
      .setDescription('Whether to send a message to the user or not'),
  );
}