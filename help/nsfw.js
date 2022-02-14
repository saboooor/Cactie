const fs = require('fs');
module.exports = (prefix, Embed) => {
	const nsfwCommands = fs.readdirSync('./commands/nsfw').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of nsfwCommands) {
		const command = require(`../commands/nsfw/${file}`);
		commands.push(`${prefix}${command.name}`);
	}
	Embed.setDescription(`
**NSFW COMMANDS:**
*All NSFW commands are based on Reddit's API. NOT cherry picked.*

**${commands.join(', ')}**
`);
};