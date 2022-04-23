const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const funCommands = fs.readdirSync('./discordcmds/fun').filter(file => file.endsWith('.js'));
	for (const file of funCommands) {
		const command = require(`../discordcmds/fun/${file}`);
		HelpEmbed.addFields([{ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` }]);
	}
	HelpEmbed.setDescription(`
**FUN COMMANDS:**
*These commands are made just for fun*
[] = Optional
`);
};