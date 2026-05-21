import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { PrivateCommand } from '~/types/Objects';

// Set the commands collection
const commands = new Collection<string, PrivateCommand>();

// Register all commands
const commandFolders = readdirSync('./src/privatecmds');
for (const file of commandFolders) {
  import(`../privatecmds/${file}`).then(command => {
    const name = Object.keys(command)[0]!;
    commands.set(name, command[name]);
  });
}
logger.info(`${commands.size} private commands loaded`);

export default commands;