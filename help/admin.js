const fs = require('fs');
module.exports = (prefix, HelpEmbed, srvconfig) => {
	const adminCommands = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
	for (const file of adminCommands) {
		const command = require(`../commands/admin/${file}`);
		if (srvconfig.adminrole != 'permission' && command.permission == 'Administrator') command.permission = `<@&${srvconfig.adminrole}>`;
		HelpEmbed.addFields({ name: `${prefix}${command.name} ${command.usage}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}\n*Permission: ${command.permission}*` });
	}
	HelpEmbed.setDescription(`
**ADMIN COMMANDS:**
*These commands require specific permissions*
[] = Optional
<> = Required
`);
};