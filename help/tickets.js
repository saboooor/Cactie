const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const ticketCommands = fs.readdirSync('./commands/tickets').filter(file => file.endsWith('.js'));
	for (const file of ticketCommands) {
		const command = require(`../commands/tickets/${file}`);
		HelpEmbed.addField({ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` });
	}
	HelpEmbed.setDescription(`
**TICKET COMMANDS:**
[] = Optional
<> = Required
`);
	HelpEmbed.addField({ name: '**How to create support tickets:**', value: `
**1.** Set the support team / staff role by doing ${prefix}settings supportrole <Role Id>
**2.** Set the ticket's category channel by doing ${prefix}settings ticketcategory <Category Id> (Optional)
**3.** Set a log channel by doing ${prefix}settings logchannel <Channel Id> (Optional)
**4.** Execute ${prefix}help supportpanel if you want to use a reaction or button to create a ticket
**5.** You're done!
` });
};