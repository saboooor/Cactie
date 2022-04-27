const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.cooldowns = new Collection();
	client.commands = new Collection();
	const commandFolders = readdirSync(`./${client.type.name}cmds`);
	for (const folder of commandFolders) {
		const commandFiles = readdirSync(`./${client.type.name}cmds/${folder}`).filter(file => file.endsWith('.js') && folder != 'options' && folder != 'message');
		for (const file of commandFiles) {
			const command = require(`../${client.type.name}cmds/${folder}/${file}`);
			client.commands.set(command.name, command);
			amount++;
		}
	}
	const universalcmdFolders = readdirSync('./universalcmds');
	for (const folder of universalcmdFolders) {
		const universalcmdFiles = readdirSync(`./universalcmds/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of universalcmdFiles) {
			const command = require(`../universalcmds/${folder}/${file}`);
			client.commands.set(command.name, command);
			amount++;
		}
	}
	client.logger.info(`${amount} message commands loaded`);
};