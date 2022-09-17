const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = client => {
	client.buttons = new Collection();
	const buttonFiles = readdirSync('./buttons').filter(file => file.endsWith('.js'));
	for (const file of buttonFiles) {
		const button = require(`../buttons/${file}`);
		client.buttons.set(button.name, button);
	}
	logger.info(`${buttonFiles.length} buttons loaded`);
};