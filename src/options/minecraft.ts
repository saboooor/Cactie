import { SlashCommandStringOption, SlashCommandNumberOption, SlashCommandBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addStringOption(
    new SlashCommandStringOption()
      .setName('fork')
      .setDescription('The minecraft server fork name')
      .setChoices(
        { name: 'Petal', value: 'petal' },
        { name: 'Purpur', value: 'purpur' },
        { name: 'Paper', value: 'paper' },
        { name: 'Waterfall', value: 'waterfall' },
        { name: 'Velocity', value: 'velocity' },
      )
      .setRequired(true),
  ).addStringOption(
    new SlashCommandStringOption()
      .setName('version')
      .setDescription('The minecraft server version'),
  ).addNumberOption(
    new SlashCommandNumberOption()
      .setName('build')
      .setDescription('The minecraft server fork build number'),
  );
}