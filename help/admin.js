module.exports = (srvconfig, Embed) => {
	Embed.setDescription(`
**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*

**${srvconfig.prefix}settings [<Setting> <Value>]**
Configure the bot
*Permission: Administrator*
**${srvconfig.prefix}kick <member id or mention> <reason>**
Kicks a member
*Permission: Kick Members*
**${srvconfig.prefix}ban <member id or mention> <reason>**
Bans a member
*Permission: Ban Members*
**${srvconfig.prefix}clear <message amount>**
Clear a lot of messages at once (Alias: ${srvconfig.prefix}purge)
*Permission: Delete Messages*
**${srvconfig.prefix}approve <message id> [response]**
Approve a suggestion (Alias: ${srvconfig.prefix}accept)
*Permission: Administrator*
**${srvconfig.prefix}deny <message id> [response]**
Deny a suggestion (Alias: ${srvconfig.prefix}decline)
*Permission: Administrator*
**${srvconfig.prefix}help support**
Walks you through how to setup support tickets in your guild
*Permission: Administrator*

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**
`);
};