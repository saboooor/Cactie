const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = client => {
	client.slashcommands = new Collection();
	const slashcommandFolders = readdirSync('./src/commands');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js') && folder != 'animals' && folder != 'private');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../commands/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
		}
	}
	logger.info(`${client.slashcommands.size} slash commands loaded`);
};