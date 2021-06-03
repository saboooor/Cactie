module.exports = (srvconfig, Embed) => {
	Embed.setDescription(`
**COMMANDS:**
*These commands can be used by anyone*

**${srvconfig.prefix}suggest <suggestion>**
Suggest something (Automatically goes to #suggestions if it exists)
**${srvconfig.prefix}poll**
Creates a poll (Automatically goes to #polls if it exists)
**${srvconfig.prefix}ticket <message>**
Creates a ticket (Alias: ${srvconfig.prefix}new)
**${srvconfig.prefix}open / close**
Opens and closes a ticket
**${srvconfig.prefix}add / remove <User Mention or ID>**
Adds and removes people from a ticket
**${srvconfig.prefix}delete**
Deletes a ticket
**${srvconfig.prefix}ping**
The bot's ping (Pong!) (Alias: ${srvconfig.prefix}pong)
**${srvconfig.prefix}boner [someone]**
See your or someone's pp size *suspense increases* (Aliases: ${srvconfig.prefix}pp, ${srvconfig.prefix}penis, ${srvconfig.prefix}erect)
**${srvconfig.prefix}instaboner [someone]**
See your or someone's pp size but speedy nyoom (Aliases: ${srvconfig.prefix}instapp, ${srvconfig.prefix}instapenis, ${srvconfig.prefix}instaerect)
**${srvconfig.prefix}react <message id> <emoji>**
React with the bot
**${srvconfig.prefix}stats [Server]**
Check the stats for pup or a Minecraft server (Alias: ${srvconfig.prefix}status)
**${srvconfig.prefix}invite**
Invite the bot to your server or join the discord server where the bot's home is!

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**
`);
};