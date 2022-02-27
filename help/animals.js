const fs = require('fs');
module.exports = (prefix, Embed) => {
	const animalCommands = fs.readdirSync('./commands/animals').filter(file => file.endsWith('.js'));
	for (const file of animalCommands) {
		const command = require(`../commands/animals/${file}`);
		Embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}`);
	}
	Embed.setDescription(`
**ANIMALS:**
`);
};