const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const utilityCommands = fs.readdirSync('./discordcmds/utilities').filter(file => file.endsWith('.js'));
	for (const file of utilityCommands) {
		const command = require(`../discordcmds/utilities/${file}`);
		HelpEmbed.addFields([{ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` }]);
	}
	HelpEmbed.setDescription(`
**UTILITY COMMANDS:**
*These commands are useful for some situations*
[] = Optional
<> = Required
`);
};