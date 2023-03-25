import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

// Set the modals collection
const modals = new Collection();

// Register all modals
const modalFiles = readdirSync('./src/modals').filter((file: string) => file.endsWith('.js'));
for (const file of modalFiles) {
	const modal = require(`../modals/${file}`);
	modals.set(modal.name, modal);
}
logger.info(`${modalFiles.length} modals loaded`);

export default modals;