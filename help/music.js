const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
	for (const file of musicCommands) {
		const command = require(`../commands/music/${file}`);
		HelpEmbed.addField({ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	HelpEmbed.setDescription(`
**MUSIC COMMANDS:**
*These commands play music in your voice chat.*
[] = Optional
<> = Required
`);
};