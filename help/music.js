const fs = require('fs');
module.exports = (prefix, Embed) => {
	const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of musicCommands) {
		const command = require(`../commands/music/${file}`);
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name} ${commands[i].usage}**${commands[i].aliases ? `\n(Aliases: ${commands[i].aliases.join(', ')})` : ''}\n${commands[i].description}`;
	});
	Embed.setDescription(`
**MUSIC COMMANDS:**
*These commands play music in your voice chat.*
[] = Optional
<> = Required

${commandlist.join('\n')}
`);
};