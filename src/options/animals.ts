import { SlashCommandSubcommandBuilder, SlashCommandBuilder } from 'discord.js';
import commands from '~/lists/commands';

export default async function options(cmd: SlashCommandBuilder) {
  const animalcommands = commands.filter(command => command.category == 'animal');
  animalcommands.forEach(command => {
    cmd.addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(command.name!)
        .setDescription(command.description),
    );
  });
}