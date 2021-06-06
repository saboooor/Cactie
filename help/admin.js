module.exports = (prefix, Embed) => {
	Embed.setDescription(`
**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*

**${prefix}settings [<Setting> <Value>]**
Configure the bot
*Permission: Administrator*
**${prefix}kick <member id or mention> <reason>**
Kicks a member
*Permission: Kick Members*
**${prefix}ban <member id or mention> <reason>**
Bans a member
*Permission: Ban Members*
**${prefix}clear <message amount>**
Clear a lot of messages at once (Alias: ${prefix}purge)
*Permission: Delete Messages*
**${prefix}approve <message id> [response]**
Approve a suggestion (Alias: ${prefix}accept)
*Permission: Administrator*
**${prefix}deny <message id> [response]**
Deny a suggestion (Alias: ${prefix}decline)
*Permission: Administrator*
**${prefix}help support**
Walks you through how to setup support tickets in your guild
*Permission: Administrator*
`);
};