const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const nsfwCommands = fs.readdirSync('./commands/nsfw').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of nsfwCommands) {
		const command = require(`../commands/nsfw/${file}`);
		commands.push(`${prefix}${command.name}`);
	}
	HelpEmbed.setDescription(`
**NSFW COMMANDS:**
*These commands have sensitive content that is NSFW*
*All NSFW commands are based on Reddit's API. NOT cherry picked.*

**${commands.join(', ')}**
`);
};