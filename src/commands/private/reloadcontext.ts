import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import contextcommands from '~/lists/context';
import { Command } from '~/types/Objects';

export const reloadcontext: Command = {
  description: 'Reloads all context commands',
  async execute(message, args, client) {
    try {
      // Check if user is sab lolololol
      if (message.author.id !== '249638347306303499') return;
      if (!client.application?.owner) await client.application?.fetch();
      const commands = await client.application?.commands.fetch();
      if (!commands) return;
      const msg = await message.channel.send({ content: 'Updating context menu commands...' });
      for (const obj of commands) {
        const command = obj[1];
        if (command.type == ApplicationCommandType.ChatInput) continue;
        if (contextcommands.find(c => c.name == command.name)) continue;
        await msg.edit({ content: `Deleting ${command.name}` });
        await command.delete();
        await msg.edit({ content: `Deleted ${command.name}` });
        await sleep(4000);
      }
      for (const obj of contextcommands) {
        const command = obj[1];

        await msg.edit({ content: `Overwriting ${command.name}` });
        console.log(command);
        const cmd = new ContextMenuCommandBuilder()
          .setName(command.name)
          .setType(ApplicationCommandType[command.type]);
        await client.application?.commands.create(cmd.toJSON());
        await msg.edit({ content: `Overwritten ${command.name}` });
        await sleep(4000);
      }
      await msg.edit({ content: 'Done!' });
      await message.reply({ content: 'All context menu commands have been updated!' });
    }
    catch (err) { error(err, message); }
  },
};