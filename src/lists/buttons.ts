import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { Button } from 'types/Objects';

// Set the buttons collection
const buttons = new Collection<string, Button>();

// Register all buttons
const buttonFiles = readdirSync('./src/buttons').filter(file => file.endsWith('.ts'));
buttonFiles.forEach(async file => {
	let button = require(`../buttons/${file}`);
	const name = Object.keys(button)[0] as keyof typeof button;
	button = { name, ...button[name] };

	buttons.set(button.name, button);
});
logger.info(`${buttonFiles.length} buttons loaded`);

export default buttons;