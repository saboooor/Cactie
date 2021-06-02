const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	client.cooldowns = new Discord.Collection();
	client.commands = new Discord.Collection();
	const commandFolders = fs.readdirSync('./commands');
	for (const folder of commandFolders) {
		const commandFolders2 = fs.readdirSync(`./commands/${folder}`);
		for (const folder2 of commandFolders2) {
			const commandFiles = fs.readdirSync(`./commands/${folder}/${folder2}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${folder2}/${file}`);
				client.commands.set(command.name, command);
			}
		}
	}
};