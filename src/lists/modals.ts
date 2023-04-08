import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Modal } from 'types/Objects';

// Set the modals collection
const modals = new Collection<string, Modal>();

// Register all modals
const modalFiles = readdirSync('./src/modals').filter(file => file.endsWith('.ts'));
modalFiles.forEach(async file => {
	let modal = require(`../modals/${file}`);
	const name = Object.keys(modal)[0] as keyof typeof modal;
	modal = { name, ...modal[name] };

	modals.set(modal.name, modal);
});
logger.info(`${modalFiles.length} modals loaded`);

export default modals;