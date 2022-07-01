const fs = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	// Set the counter to count the amount of reactions
	let count = 0;

	// Set the reactions collection
	client.reactions = new Collection();

	// Register all reactions
	const reactionFiles = fs.readdirSync('./reactions').filter(file => file.endsWith('.js'));
	for (const file of reactionFiles) {
		const reaction = require(`../reactions/${file}`);
		client.reactions.set(reaction.name, reaction);
		count++;
	}
	client.logger.info(`${count} reactions loaded`);
};