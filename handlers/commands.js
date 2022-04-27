const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.cooldowns = new Collection();
	client.commands = new Collection();
	const commandFolders = readdirSync(`./commands/${client.type.name}`);
	for (const folder of commandFolders) {
		const commandFiles = readdirSync(`./commands/${client.type.name}/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
		for (const file of commandFiles) {
			const command = require(`../commands/${client.type.name}/${folder}/${file}`);
			client.commands.set(command.name, command);
			amount++;
		}
	}
	const universalcmdFolders = readdirSync('./commands/universal');
	for (const folder of universalcmdFolders) {
		const universalcmdFiles = readdirSync(`./commands/universal/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of universalcmdFiles) {
			const command = require(`../commands/universal/${folder}/${file}`);
			client.commands.set(command.name, command);
			amount++;
		}
	}
	client.logger.info(`${amount} message commands loaded`);
};