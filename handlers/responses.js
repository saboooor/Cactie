const fs = require('fs');
const Discord = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.response = new Discord.Collection();
	const responseFiles = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
	for (const file of responseFiles) {
		const response = require(`../responses/${file}`);
		client.response.set(response.name, response);
		amount = amount + 1;
	}
	client.logger.info(`${amount} responses loaded`);
};