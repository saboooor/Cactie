const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.slashcommands = new Collection();
	const types = ['discord', 'universal'];
	types.forEach(type => {
		const slashcommandFolders = readdirSync(`./commands/${type}`);
		for (const folder of slashcommandFolders) {
			const slashcommandFiles = readdirSync(`./commands/${type}/${folder}`).filter(file => file.endsWith('.js') && folder != 'nsfw' && folder != 'options' && folder != 'private');
			for (const file of slashcommandFiles) {
				const slashcommand = require(`../../commands/${type}/${folder}/${file}`);
				client.slashcommands.set(slashcommand.name, slashcommand);
				amount++;
			}
		}
	});
	client.logger.info(`${amount} slash commands loaded`);
};