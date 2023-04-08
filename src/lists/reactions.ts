import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Reaction } from 'types/Objects';

// Set the reactions collection
const reactions = new Collection<string, Reaction>();

// Register all reactions
const reactionFiles = readdirSync('./src/reactions').filter(file => file.endsWith('.ts'));
reactionFiles.forEach(async file => {
	let reaction = require(`../reactions/${file}`);
	const name = Object.keys(reaction)[0] as keyof typeof reaction;
	reaction = { name, ...reaction[name] };

	reactions.set(reaction.name, reaction);
	if (reactionFiles.indexOf(file) == reactionFiles.length - 1) logger.info(`${reactionFiles.length} reactions loaded`);
});

export default reactions;