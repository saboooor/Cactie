const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const actionCommands = fs.readdirSync('./universalcmds/actions').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of actionCommands) {
		const command = require(`../universalcmds/actions/${file}`);
		commands.push(`${prefix}${command.name}`);
	}
	HelpEmbed.setDescription(`
**ACTION COMMANDS:**
*These commands let you do stuff to people idk*
*All these commands can be suffixed with a user @ to do the action on them.*

**${commands.join(', ')}**
`);
};