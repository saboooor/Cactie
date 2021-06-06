module.exports = (prefix, Embed) => {
	Embed.setDescription(`
**COMMANDS:**
*These commands can be used by anyone*

**Fun:**
**${prefix}boner [someone]**
See your or someone's pp size *suspense increases* (Aliases: ${prefix}pp, ${prefix}penis, ${prefix}erect)
**${prefix}instaboner [someone]**
See your or someone's pp size but speedy nyoom (Aliases: ${prefix}instapp, ${prefix}instapenis, ${prefix}instaerect)

**Tickets:**
**${prefix}ticket <message>**
Creates a ticket (Alias: ${prefix}new)
**${prefix}open / close**
Opens and closes a ticket
**${prefix}add / remove <User Mention or ID>**
Adds and removes people from a ticket
**${prefix}delete**
Deletes a ticket

**Utilities:**
**${prefix}server**
Show this Discord server's information
**${prefix}ping**
The bot's ping (Pong!) (Alias: ${prefix}pong)
**${prefix}suggest <suggestion>**
Suggest something (Automatically goes to #suggestions if it exists)
**${prefix}poll**
Creates a poll (Automatically goes to #polls if it exists)
**${prefix}stats [Server]**
Check the stats for pup or a Minecraft server (Alias: ${prefix}status)
**${prefix}invite**
Invite the bot to your server or join the discord server where the bot's home is!
`);
};