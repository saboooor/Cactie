module.exports = (srvconfig, Embed) => {
	Embed.setDescription(`
**How to create support tickets:**
1. Set the ticket's category channel by doing ${srvconfig.prefix}settings ticketcategory <Category ID> (Optional)
2. Set the support team / staff role by doing ${srvconfig.prefix}settings supportrole <Role ID>
3. Set a log channel by doing ${srvconfig.prefix}settings ticketlogchannel <Channel ID> (Optional)
4. Create a role that contains the word "staff"
5. Execute \`${srvconfig.prefix}help supportpanel\` if you want to use a reaction to create a ticket
Otherwise just do ${srvconfig.prefix}ticket or ${srvconfig.prefix}new to create a ticket
6. You're done!
`);
};