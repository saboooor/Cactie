const fs = require('fs');
module.exports = (prefix, Embed) => {
	const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
	for (const file of musicCommands) {
		const command = require(`../commands/music/${file}`);
		Embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}`);
	}
	Embed.setDescription(`
**MUSIC COMMANDS:**
*These commands play music in your voice chat.*
[] = Optional
<> = Required
`);
};