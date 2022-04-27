const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.cooldowns = new Collection();
	client.commands = new Collection();
	const types = [client.type.name, 'universal'];
	types.forEach(type => {
		const commandFolders = readdirSync(`./commands/${type}`);
		for (const folder of commandFolders) {
			const commandFiles = readdirSync(`./commands/${type}/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
			for (const file of commandFiles) {
				const command = require(`../../commands/${type}/${folder}/${file}`);
				client.commands.set(command.name, command);
				amount++;
			}
		}
	});
	client.logger.info(`${amount} message commands loaded`);
};