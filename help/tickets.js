const fs = require('fs');
module.exports = (prefix, Embed) => {
	const ticketCommands = fs.readdirSync('./commands/tickets').filter(file => file.endsWith('.js'));
	for (const file of ticketCommands) {
		const command = require(`../commands/tickets/${file}`);
		Embed.addField(`${prefix}${command.name} ${command.usage ? command.usage : ''}`, `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}`);
	}
	Embed.setDescription(`
**TICKET COMMANDS:**
[] = Optional
<> = Required
`);
	Embed.addField('**How to create support tickets:**', `
**1.** Set the support team / staff role by doing ${prefix}settings supportrole <Role Id>
**2.** Set the ticket's category channel by doing ${prefix}settings ticketcategory <Category Id> (Optional)
**3.** Set a log channel by doing ${prefix}settings logchannel <Channel Id> (Optional)
**4.** Execute ${prefix}help supportpanel if you want to use a reaction or button to create a ticket
**5.** You're done!
`);
};