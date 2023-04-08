import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { ContextMenuCommand } from 'types/Objects';

// Set the contextcommands collection
const contextcommands = new Collection<string, ContextMenuCommand>();

// Register all context menu commands
const commandFiles = readdirSync('./src/context');
for (const file of commandFiles) {
	const command = require(`../context/${file}`);
	contextcommands.set(command.name, command);
}
logger.info(`${contextcommands.size} context commands loaded`);

export default contextcommands;