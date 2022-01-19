const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.slashcommands = new Collection();
	const slashcommandFolders = readdirSync('./commands');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw' && folder != 'private' && folder != 'reaction');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../commands/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
			amount = amount + 1;
		}
	}
	client.logger.info(`${amount} slash commands loaded`);
};