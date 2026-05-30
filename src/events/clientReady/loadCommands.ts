import { ApplicationCommandType, Client, ContextMenuCommandBuilder, SlashCommandBuilder, type ApplicationCommandDataResolvable } from 'discord.js';
import commands from '~/lists/cmds';
import contextcommands from '~/lists/context';

const truncateString = (string: string, maxLength: number) =>
  string.length > maxLength
    ? `${string.substring(0, maxLength)}…`
    : string;

export default async (client: Client) =>{
  const cmds: ApplicationCommandDataResolvable[] = [];

  await Promise.all([
    ...commands.map(async (command) => {
      logger.info(`Loading slash command ${command.name}`);

      // set name and description from command object
      const cmd = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(truncateString(command.description, 99));

      // Add any options from the command object
      if (command.cmd) command.cmd(cmd);

      cmds.push(cmd);
    }),
    ...contextcommands.map(async (command) => {
      logger.info(`Loading context command ${command.name}`);

      // set name and type from command object
      const cmd = (command.cmd ?? new ContextMenuCommandBuilder())
        .setName(command.name)
        .setType(ApplicationCommandType[command.type]);

      cmds.push(cmd);
    }),
  ]);
  console.log(cmds.map(c => c.name).join(', '));

  await client.application?.commands.set(cmds, '811354612547190794');
  logger.info(`${cmds.length} slash/context commands loaded`);
};