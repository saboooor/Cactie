const fs = require('fs');
module.exports = (prefix, HelpEmbed) => {
	const ticketCommands = fs.readdirSync('./discordcmds/tickets').filter(file => file.endsWith('.js'));
	for (const file of ticketCommands) {
		const command = require(`../discordcmds/tickets/${file}`);
		HelpEmbed.addFields([{ name: `${prefix}${command.name} ${command.usage ? command.usage : ''}`, value: `${command.aliases ? `\n(Aliases: ${command.aliases.join(', ')})` : ''}\n${command.description}` }]);
	}
	HelpEmbed.setDescription(`
**TICKET COMMANDS:**
*These commands are related to Cactie's ticket system*
[] = Optional
<> = Required
`);
	HelpEmbed.addFields([{ name: '**How to create support tickets:**', value: `
**1.** Set the support team / staff role by doing /settings supportrole
**2.** Set the ticket's category channel by doing /settings ticketcategory (Optional)
**3.** Set a log channel by doing /settings logchannel (Optional)
**4.** Execute ${prefix}help supportpanel if you want to use a reaction or button to create a ticket
**5.** You're done!
` }]);
};