const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	client.buttons = new Discord.Collection();
	const responseFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
	for (const file of responseFiles) {
		const button = require(`../buttons/${file}`);
		client.buttons.set(button.name, button);
	}
};