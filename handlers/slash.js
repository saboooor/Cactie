const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.slashcommands = new Discord.Collection();
	const slashcommandFolders = fs.readdirSync('./commands');
	for (const folder of slashcommandFolders) {
		const slashcommandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') && !file.endsWith('_noslash.js') && folder != 'nsfw');
		for (const file of slashcommandFiles) {
			const slashcommand = require(`../commands/${folder}/${file}`);
			client.slashcommands.set(slashcommand.name, slashcommand);
			amount = amount + 1;
		}
	}
	client.logger.info(`${amount} slash commands loaded`);
};