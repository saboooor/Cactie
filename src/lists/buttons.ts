import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Button } from 'types/Objects';

const buttons = new Collection<string, Button>();
const buttonFiles = readdirSync('./src/buttons').filter(file => file.endsWith('.ts'));
for (const file of buttonFiles) {
	const button = require(`../buttons/${file}`);
	buttons.set(button.name, button);
}
logger.info(`${buttonFiles.length} buttons loaded`);

export default buttons;