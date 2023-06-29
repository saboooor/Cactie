import { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import slashcommands from '~/lists/slash';
import contextcommands from '~/lists/context';
import { Command } from '~/types/Objects';
const truncateString = (string: string, maxLength: number) =>
  string.length > maxLength
    ? `${string.substring(0, maxLength)}…`
    : string;

export const reloadcmds: Command = {
  description: 'Reloads all slash commands',
  async execute(message, args, client) {
    try {
      if (!client.application) return;
      if (!client.application.owner) await client.application.fetch();

      const cmds = [];
      for (const obj of slashcommands) {
        const command = obj[1];
        const cmd = new SlashCommandBuilder()
          .setName(command.name!)
          .setDescription(truncateString(command.description, 99));
        if (command.options) await command.options(cmd);
        cmds.push(cmd);
      }
      for (const obj of contextcommands) {
        const command = obj[1];
        const cmd = new ContextMenuCommandBuilder()
          .setName(command.name!)
          .setType(ApplicationCommandType[command.type]);
        cmds.push(cmd);
      }
      await client.application.commands.set(cmds);

      await message.reply({ content: 'All slash/context commands have been updated!' });
    }
    catch (err) { error(err, message); }
  },
};