const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const YAML = require('yaml');
const { servers } = YAML.parse(fs.readFileSync('./pterodactyl.yml', 'utf8'));
module.exports = {
	name: 'link',
	description: 'Sends a linking guide for DiscordSRV (Config will be moved to pterodactyl.json)',
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const srv = servers.find(s => s.guildid == message.guild.id && s.minecraft && s.minecraft.botid);
			const bot = message.guild.members.cache.get(srv.minecraft.botid);
			const LinkEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('DISCORD LINKING')
				.setDescription(`**Follow these steps to link your Discord and Minecraft accounts**
**1.** If you are not already on the server, join it.
**2.** Use the command \`/discord link\` in-game.
**3.** Click here -> ${bot}
**4.** Enter the 4 digit code in the box that reads \`Message @${bot.user.username}\`
**5.** Hit enter. Your account should now be linked!

**Having Trouble?**
If after step 3, you do not see a box that says \`Message @${bot.user.username}\`, you disabled direct messages from server members. To turn this back on, follow the steps below:
**1.** On your list of Discord servers in the left-hand servers tab, you should see ${message.guild.name}. Right click it.
**2.** Click Privacy \`Settings\`
**3.** Enable the setting labeled \`Allow direct messages from server members\`.`);
			const row = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('create_ticket')
						.setLabel('Still have an issue? Create a ticket by clicking here!')
						.setStyle(ButtonStyle.Secondary),
				]);
			message.reply({ embeds: [LinkEmbed], components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};
