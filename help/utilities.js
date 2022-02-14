const fs = require('fs');
module.exports = (prefix, Embed) => {
	const utilityCommands = fs.readdirSync('./commands/utilities').filter(file => file.endsWith('.js'));
	for (const file of utilityCommands) {
		const command = require(`../commands/utilities/${file}`);
		Embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}`);
	}
	Embed.setDescription(`
**UTILITY COMMANDS:**
[] = Optional
<> = Required
`);
};