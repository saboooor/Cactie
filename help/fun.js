const fs = require('fs');
module.exports = (prefix, Embed) => {
	const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
	for (const file of funCommands) {
		const command = require(`../commands/fun/${file}`);
		Embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}`);
	}
	Embed.setDescription(`
**FUN COMMANDS:**
[] = Optional
`);
};