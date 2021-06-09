const fs = require('fs');
module.exports = (prefix, Embed, client) => {
	const ticketCommands = fs.readdirSync('./commands/tickets').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of ticketCommands) {
		const command = require(`../commands/tickets/${file}`);
		if (!command.usage) command.usage = '';
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name} ${commands[i].usage}**\n${commands[i].description}`;
	});
	Embed.setDescription(`
**TICKET COMMANDS:**
[] = Optional
<> = Required

${commandlist.join('\n')}

**How to create support tickets:**
**1.** Set the support team / staff role by doing ${prefix}settings supportrole <Role ID>
**2.** Set the ticket's category channel by doing ${prefix}settings ticketcategory <Category ID> (Optional)
**3.** Set a log channel by doing ${prefix}settings ticketlogchannel <Channel ID> (Optional)
**4.** Execute ${prefix}help supportpanel if you want to use a reaction or button to create a ticket
**5.** You're done!
`);
};