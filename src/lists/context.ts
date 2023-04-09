import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { ContextMenuCommand } from 'types/Objects';

// Set the contextcommands collection
const contextcommands = new Collection<string, ContextMenuCommand>();

// Register all context menu commands
const contextFiles = readdirSync('./src/context');
contextFiles.forEach(async file => {
	let context = require(`../context/${file}`);
	const name = Object.keys(context)[0] as keyof typeof context;
	context = { name, ...context[name] };

	contextcommands.set(context.name, context);
});
logger.info(`${contextFiles.length} context menu commands loaded`);

export default contextcommands;