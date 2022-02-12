const fs = require('fs');
module.exports = (prefix, Embed, srvconfig) => {
	const adminCommands = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
	for (const file of adminCommands) {
		const command = require(`../commands/admin/${file}`);
		if (srvconfig.adminrole != 'permission' && command.permission == 'ADMINISTRATOR') command.permission = `<@&${srvconfig.adminrole}>`;
		Embed.addField({ name: `${prefix}${command.name} ${command.usage}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}\n*Permission: ${command.permission}*` });
	}
	Embed.setDescription(`
**ADMIN COMMANDS:**
*These commands require the member to have specified permissions.*
[] = Optional
<> = Required
`);
};