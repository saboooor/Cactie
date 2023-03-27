import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Command } from 'types/Objects';

// Set the commands collection
const commands = new Collection<string, Command>();
const cooldowns = new Collection();

// Register all commands
const commandFolders = readdirSync('./src/commands');
for (const folder of commandFolders) {
	const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
	for (const file of commandFiles) {
		const command = require(`../commands/${folder}/${file}`);
		command.category = folder;
		commands.set(command.name, command);
	}
}
logger.info(`${commands.size} text commands loaded`);

export default commands;
export { cooldowns };