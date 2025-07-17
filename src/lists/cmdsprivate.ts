import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Command } from '~/types/Objects';

// Set the commands collection
const commands = new Collection<string, Command>();

// Register all commands
const commandFolders = readdirSync('./src/commands');
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('ts') && folder == 'private');
  for (const file of commandFiles) {
    import(`../commands/${folder}/${file}`).then(command => {
      const name = Object.keys(command)[0];
      commands.set(name, command[name]);
    });
  }
}
logger.info(`${commands.size} private commands loaded`);

export default commands;