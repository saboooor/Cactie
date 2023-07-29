import { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, PermissionsBitField } from 'discord.js';
import slashcommands from '~/lists/slash';
import contextcommands from '~/lists/context';
import { Command } from '~/types/Objects';

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
          .setDescription(command.description)
          .setDMPermission(command.category != 'admin' && command.category != 'tickets');
        if (command.permission) cmd.setDefaultMemberPermissions(PermissionsBitField.Flags[command.permission]);

        if (command.options) await command.options(cmd);
        cmds.push(cmd);
      }
      for (const obj of contextcommands) {
        const command = obj[1];
        const cmd = new ContextMenuCommandBuilder()
          .setName(command.name!)
          .setType(ApplicationCommandType[command.type])
          .setDMPermission(false);
        if (command.permission) cmd.setDefaultMemberPermissions(PermissionsBitField.Flags[command.permission]);
        cmds.push(cmd);
      }
      await client.application.commands.set(cmds);

      await message.reply({ content: 'All slash/context commands have been updated!' });
    }
    catch (err) { error(err, message); }
  },
};