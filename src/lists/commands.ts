import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Command } from '~/types/Objects';

// Set the commands collection
const commands = new Collection<string, Command>();
const cooldowns = new Collection<string, Collection<string, number>>();

// Register all commands
const commandFolders = readdirSync('./src/commands');
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => (file.endsWith('.js') || file.endsWith('ts')) && folder != 'options' && folder != 'message');
  for (const file of commandFiles) {
    let command = require(`../commands/${folder}/${file}`);
    const name = Object.keys(command)[0] as keyof typeof command;

    command = { name: command.name ?? name, category: folder, ...command[name] };
    commands.set(command.name, command);
  }
}
logger.info(`${commands.size} text commands loaded`);

export default commands;
export { cooldowns };