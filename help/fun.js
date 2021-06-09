const fs = require('fs');
module.exports = (prefix, Embed, client) => {
	const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of funCommands) {
		const command = require(`../commands/fun/${file}`);
		if (!command.usage) command.usage = '';
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name} ${commands[i].usage}**\n${commands[i].description}`;
	});
	Embed.setDescription(`
**FUN COMMANDS:**
[] = Optional

${commandlist.join('\n')}
`);
};