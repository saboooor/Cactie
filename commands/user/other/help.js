module.exports = {
	name: 'help',
	description: 'Get help with pup',
	aliases: ['commands'],
	cooldown: 2,
	async execute(message, args, client, Discord) {
		const srvconfig = client.settings.get(message.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215));
		let arg = args[0];
		if (arg) arg = arg.toLowerCase();
		if (arg == 'commands') {
			Embed.setDescription(`**BOT FEATURES:**
*This is what the bot can do other than commands*
\`${srvconfig.prefix}help features\`

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

**NSFW COMMANDS:**
*NSFW commands :flushed:*
\`${srvconfig.prefix}help nsfw\`

**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*
\`${srvconfig.prefix}help admin\`

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**`);
		}
		else if (arg == 'features') {
			Embed.setDescription(`**BOT FEATURES:**
*This is what the bot can do other than commands*

- Support tickets
- Suggestions

**COMMANDS:**
*These commands can be used by anyone*
\`${srvconfig.prefix}help commands\`

**NSFW COMMANDS:**
*NSFW commands :flushed:*
\`${srvconfig.prefix}help nsfw\`

**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*
\`${srvconfig.prefix}help admin\`

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**`);
		}
		else if (arg == 'admin') {
			Embed.setDescription(`**BOT FEATURES:**
*This is what the bot can do other than commands*
\`${srvconfig.prefix}help features\`

**COMMANDS:**
*These commands can be used by anyone*
\`${srvconfig.prefix}help commands\`

**NSFW COMMANDS:**
*NSFW commands :flushed:*
\`${srvconfig.prefix}help nsfw\`

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
**Still need help with the bot? Do ${srvconfig.prefix}invite!**`);
		}
		else if (arg == 'nsfw') {
			Embed.setDescription(`**BOT FEATURES:**
*This is what the bot can do other than commands*
\`${srvconfig.prefix}help features\`

**COMMANDS:**
*These commands can be used by anyone*
\`${srvconfig.prefix}help commands\`

**NSFW COMMANDS:**
*NSFW commands :flushed:*

**${srvconfig.prefix}hentai**

**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*
\`${srvconfig.prefix}help admin\`

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**`);
		}
		else if (arg == 'support') {
			Embed.setDescription(`**How to create support tickets:**
1. Set the ticket's category channel by doing ${srvconfig.prefix}settings ticketcategory <Category ID> (Optional)
2. Set the support team / staff role by doing ${srvconfig.prefix}settings supportrole <Role ID>
3. Set a log channel by doing ${srvconfig.prefix}settings ticketlogchannel <Channel ID> (Optional)
4. Create a role that contains the word "staff"
5. Execute \`${srvconfig.prefix}help supportpanel\` if you want to use a reaction to create a ticket
Otherwise just do ${srvconfig.prefix}ticket or ${srvconfig.prefix}new to create a ticket
6. You're done!`);
		}
		else if (arg == 'supportpanel') {
			if (!message.member.permissions.has('ADMINISTRATOR')) return;
			Embed.setDescription('Created support panel! You may now delete this message, otherwise it\'ll be deleted in 10 seconds');
			const Panel = new Discord.MessageEmbed()
				.setColor(3447003)
				.setTitle('Need help? No problem!')
				.setDescription('React with 🎫 to open a ticket!')
				.setFooter(`${message.guild.name} Support`, message.guild.iconURL());
			const msg = await message.channel.send(Panel);
			await msg.react('🎫');
		}
		else {
			Embed.setDescription(`**BOT FEATURES:**
*This is what the bot can do other than commands*
\`${srvconfig.prefix}help features\`

**COMMANDS:**
*These commands can be used by anyone*
\`${srvconfig.prefix}help commands\`

**NSFW COMMANDS:**
*NSFW commands :flushed:*
\`${srvconfig.prefix}help nsfw\`

**ADMIN COMMANDS:**
*These commands require the member to have specified permissions*
\`${srvconfig.prefix}help admin\`

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**`);
		}
		message.channel.send(Embed);
	},
};