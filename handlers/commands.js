const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.cooldowns = new Discord.Collection();
	client.commands = new Discord.Collection();
	const commandFolders = fs.readdirSync('./commands');
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
			amount = amount + 1;
		}
	}
	client.logger.info(`${amount} commands loaded`);
};