const fs = require('fs');
module.exports = (prefix, Embed) => {
	const utilityCommands = fs.readdirSync('./commands/utilities').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of utilityCommands) {
		const command = require(`../commands/utilities/${file}`);
		if (!command.usage) command.usage = '';
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name} ${commands[i].usage}**${commands[i].aliases ? `\n(Aliases: ${commands[i].aliases.join(', ')})` : ''}\n${commands[i].description}`;
	});
	Embed.setDescription(`
**UTILITY COMMANDS:**
[] = Optional
<> = Required

${commandlist.join('\n')}
`);
};