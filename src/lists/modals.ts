import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Modal } from '~/types/Objects';

// Set the modals collection
const modals = new Collection<string, Modal>();

// Register all modals
const modalFiles = readdirSync('./src/modals').filter(file => file.endsWith('.ts'));
(async () => {
  for (const file of modalFiles) {
    const modalModule = await import(`../modals/${file}`);
    const name = Object.keys(modalModule)[0] as keyof typeof modalModule;
    const modal = { name, ...modalModule[name] };

    modals.set(modal.name, modal);
  }
  logger.info(`${modalFiles.length} modals loaded`);
})();

export default modals;