const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const utilityCommands = fs.readdirSync('./commands/utilities').filter(file => file.endsWith('.js'));
	for (const file of utilityCommands) {
		const command = require(`../commands/utilities/${file}`);
		HelpEmbed.addFields({ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	HelpEmbed.setDescription(`
**UTILITY COMMANDS:**
[] = Optional
<> = Required
`);
};