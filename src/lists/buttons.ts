import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

const buttons = new Collection();
const buttonFiles = readdirSync('./src/buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`../buttons/${file}`);
	buttons.set(button.name, button);
}
logger.info(`${buttonFiles.length} buttons loaded`);

export default buttons;