const fs = require('fs');
module.exports = (prefix, Embed) => {
	const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
	for (const file of funCommands) {
		const command = require(`../commands/fun/${file}`);
		Embed.addField({ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	Embed.setDescription(`
**FUN COMMANDS:**
[] = Optional
`);
};