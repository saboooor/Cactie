const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	client.cooldowns = new Discord.Collection();
	client.commands = new Discord.Collection();
	const commandFolders = fs.readdirSync('./commands');
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		}
	}
	client.logger.info('Command files loaded!');
};