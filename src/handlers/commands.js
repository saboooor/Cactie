const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = client => {
	// Set the cooldowns and commands collections
	client.cooldowns = new Collection();
	client.commands = new Collection();

	// Register all commands
	const commandFolders = readdirSync('./src/commands');
	for (const folder of commandFolders) {
		const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			command.category = folder;
			client.commands.set(command.name, command);
		}
	}
	logger.info(`${client.commands.size} text commands loaded`);
};