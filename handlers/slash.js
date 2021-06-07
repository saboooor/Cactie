const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	client.slashcommands = new Discord.Collection();
	const slashcommandFolders = fs.readdirSync('./commands');
	for (const folder of slashcommandFolders) {
		const slashcommandFolders2 = fs.readdirSync(`./commands/${folder}`);
		for (const folder2 of slashcommandFolders2) {
			const slashcommandFiles = fs.readdirSync(`./commands/${folder}/${folder2}`).filter(file => file.endsWith('.js') && !file.endsWith('_noslash.js') && folder2 != 'nsfw');
			for (const file of slashcommandFiles) {
				const slashcommand = require(`../commands/${folder}/${folder2}/${file}`);
				client.slashcommands.set(slashcommand.name, slashcommand);
			}
		}
	}
	client.logger.info('Slash Command files loaded!');
};