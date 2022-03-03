const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const funCommands = fs.readdirSync('./commands/actions').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of funCommands) {
		const command = require(`../commands/actions/${file}`);
		commands.push(`${prefix}${command.name}`);
	}
	HelpEmbed.setDescription(`
**ACTION COMMANDS:**
*These commands let you do stuff to people idk*
*All these commands can be suffixed with a user @ to do the action on them.*

**${commands.join(', ')}**
`);
};