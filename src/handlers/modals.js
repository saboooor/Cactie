const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = client => {
	client.modals = new Collection();
	const modalFiles = readdirSync('./src/modals').filter(file => file.endsWith('.js'));
	for (const file of modalFiles) {
		const modal = require(`../modals/${file}`);
		client.modals.set(modal.name, modal);
	}
	logger.info(`${modalFiles.length} modals loaded`);
};