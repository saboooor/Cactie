const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	client.slashcommands = new Discord.Collection();
	const slashcommandFolders = fs.readdirSync('./slashcommands');
	for (const folder of slashcommandFolders) {
		const slashcommandFolders2 = fs.readdirSync(`./slashcommands/${folder}`);
		for (const folder2 of slashcommandFolders2) {
			const slashcommandFiles = fs.readdirSync(`./slashcommands/${folder}/${folder2}`).filter(file => file.endsWith('.js'));
			for (const file of slashcommandFiles) {
				const slashcommand = require(`../slashcommands/${folder}/${folder2}/${file}`);
				client.slashcommands.set(slashcommand.name, slashcommand);
			}
		}
	}
};