const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.contextcmds = new Collection();
	const contextcmdFiles = readdirSync('./commands/context');
	for (const file of contextcmdFiles) {
		const contextcmd = require(`../../commands/context/${file}`);
		client.contextcmds.set(contextcmd.name, contextcmd);
		amount++;
	}
	client.logger.info(`${amount} context menu commands loaded`);
};