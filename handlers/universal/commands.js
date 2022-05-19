const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	// Set the counter to count the amount of commands
	let count = 0;

	// Set the cooldowns and commands collections
	client.cooldowns = new Collection();
	client.commands = new Collection();

	// Register all commands
	const types = [client.type.name, 'universal'];
	types.forEach(type => {
		const commandFolders = readdirSync(`./commands/${type}`);
		for (const folder of commandFolders) {
			const commandFiles = readdirSync(`./commands/${type}/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
			for (const file of commandFiles) {
				const command = require(`../../commands/${type}/${folder}/${file}`);
				command.category = folder;
				client.commands.set(command.name, command);
				count++;
			}
		}
	});
	client.logger.info(`${count} text commands loaded`);
};