const fs = require('fs');
const { Collection } = require('discord.js');
module.exports = client => {
	let amount = 0;
	client.dropdowns = new Collection();
	const dropdownFiles = fs.readdirSync('./dropdowns').filter(file => file.endsWith('.js'));
	for (const file of dropdownFiles) {
		const dropdown = require(`../dropdowns/${file}`);
		client.dropdowns.set(dropdown.name, dropdown);
		amount = amount + 1;
	}
	client.logger.info(`${amount} dropdowns loaded`);
};