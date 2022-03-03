const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const funCommands = fs.readdirSync('./commands/animals').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of funCommands) {
		const command = require(`../commands/animals/${file}`);
		commands.push(`${prefix}${command.name}`);
	}
	HelpEmbed.setDescription(`
**ANIMAL COMMANDS:**
*These commands show cute animals*

**${commands.join(', ')}**
`);
};