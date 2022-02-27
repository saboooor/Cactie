const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const funCommands = fs.readdirSync('./commands/animals').filter(file => file.endsWith('.js'));
	for (const file of funCommands) {
		const command = require(`../commands/animals/${file}`);
		HelpEmbed.addField({ name: `${prefix}${command.name}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	HelpEmbed.setDescription(`
**ANIMALS:**
`);
};