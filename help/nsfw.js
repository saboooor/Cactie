const fs = require('fs');
module.exports = (prefix, Embed) => {
	const nsfwCommands = fs.readdir('./commands/nsfw').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of nsfwCommands) {
		const command = require(`../commands/nsfw/${file}`);
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name}**`;
	});
	Embed.setDescription(`
**NSFW COMMANDS:**
*All NSFW commands are based on Reddit's API. NOT cherry picked.*

${commandlist.join(', ')}
`);
};