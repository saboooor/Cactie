import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { PrivateCommand } from '~/lists/Objects';

// Set the commands collection
const commands = new Collection<string, PrivateCommand>();

// Register all commands
const commandFolders = readdirSync('./src/privatecmds');
await Promise.all(commandFolders.map(async file => {
  const module = await import(`../privatecmds/${file}`);

  const name = Object.keys(module)[0]!;
  commands.set(name, module[name]);
}));
logger.info(`${commands.size} private commands loaded`);

export default commands;