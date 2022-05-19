const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.contextcmds = new Collection();
	const contextcmdFolders = readdirSync('./commands/context');
	for (const folder of contextcmdFolders) {
		const contextcmdFiles = readdirSync(`./commands/context/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of contextcmdFiles) {
			const contextcmds = require(`../../commands/context/${folder}/${file}`);
			contextcmds.type = folder;
			client.contextcmds.set(contextcmds.name, contextcmds);
			amount++;
		}
	}
	client.logger.info(`${amount} context menu commands loaded`);
};