const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = client => {
	client.slashcommands = new Collection();
	const slashcommandFolders = readdirSync('./commands');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw' && folder != 'animals' && folder != 'private');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../commands/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
		}
	}
	logger.info(`${client.slashcommands.size} slash commands loaded`);
};