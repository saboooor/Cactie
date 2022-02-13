const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
	for (const file of funCommands) {
		const command = require(`../commands/fun/${file}`);
		HelpEmbed.addField({ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	HelpEmbed.setDescription(`
**FUN COMMANDS:**
[] = Optional
`);
};