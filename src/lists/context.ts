import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { ContextMenuCommand } from 'types/Objects';

// Set the contextcommands collection
const contextcommands = new Collection<string, ContextMenuCommand<'Message'> | ContextMenuCommand<'User'>>();

// Register all context menu commands
const contextFiles = readdirSync('./src/context');
contextFiles.forEach(async file => {
	const context = require(`../context/${file}`);
	contextcommands.set(context.name, context);
});
logger.info(`${contextFiles.length} context menu commands loaded`);

export default contextcommands;