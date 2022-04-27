const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.slashcommands = new Collection();
	const slashcommandFolders = readdirSync('./commands/discord');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = readdirSync(`./commands/discord/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw' && folder != 'options' && folder != 'private');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../../commands/discord/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
			amount = amount + 1;
		}
	}
	const unislashcommandFolders = readdirSync('./commands/universal');
	for (const folder of unislashcommandFolders) {
		const slashcommandFiles = readdirSync(`./commands/universal/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../../commands/universal/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
			amount = amount + 1;
		}
	}
	client.logger.info(`${amount} slash commands loaded`);
};