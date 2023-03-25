import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

// Set the reactions collection
const reactions = new Collection();

// Register all reactions
const reactionFiles = readdirSync('./src/reactions').filter(file => file.endsWith('.js'));
for (const file of reactionFiles) {
	const reaction = require(`../reactions/${file}`);
	reactions.set(reaction.name, reaction);
}
logger.info(`${reactionFiles.length} reactions loaded`);

export default reactions;