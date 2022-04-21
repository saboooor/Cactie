const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.slashcommands = new Collection();
	const slashcommandFolders = readdirSync('./discordcmds');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = readdirSync(`./discordcmds/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw' && folder != 'private');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../../discordcmds/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
			amount = amount + 1;
		}
	}
	client.logger.info(`${amount} slash commands loaded`);
};