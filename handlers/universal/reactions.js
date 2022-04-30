const fs = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.reactions = new Collection();
	const reactionFiles = fs.readdirSync(`./reactions/${client.type.name}`).filter(file => file.endsWith('.js'));
	for (const file of reactionFiles) {
		const reaction = require(`../../reactions/${client.type.name}/${file}`);
		client.reactions.set(reaction.name, reaction);
		amount = amount + 1;
	}
	client.logger.info(`${amount} reactions loaded`);
};