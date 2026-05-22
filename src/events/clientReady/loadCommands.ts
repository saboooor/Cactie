import { ApplicationCommandType, Client, ContextMenuCommandBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import commands from '~/lists/cmds';
import contextcommands from '~/lists/context';

const truncateString = (string: string, maxLength: number) =>
  string.length > maxLength
    ? `${string.substring(0, maxLength)}…`
    : string;

export default async (client: Client) =>{
  const cmds = [];

  for (const obj of commands){
    const command = obj[1];
    logger.info(`Loading slash command ${command.name}`);

    const cmd = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(truncateString(command.description, 99))
      .setDMPermission(command.category != 'admin' && command.category != 'tickets');
    if (command.permission) cmd.setDefaultMemberPermissions(PermissionsBitField.Flags[command.permission]);
    if (command.options) command.options(cmd);
    cmds.push(cmd);
  }

  for (const obj of contextcommands) {
    const command = obj[1];
    logger.info(`Loading context command ${command.name}`);

    const cmd = new ContextMenuCommandBuilder()
      .setName(command.name!)
      .setType(ApplicationCommandType[command.type])
      .setDMPermission(false);
    if (command.permission) cmd.setDefaultMemberPermissions(PermissionsBitField.Flags[command.permission]);
    cmds.push(cmd);
  }

  await client.application?.commands.set(cmds, '811354612547190794');
  logger.info(`${cmds.length} slash/context commands loaded`);
};