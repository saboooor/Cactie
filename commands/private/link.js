const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'link',
	description: 'Sends a linking guide for DiscordSRV (Config will be moved to pterodactyl.json)',
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const serverlist = Object.keys(servers).map(i => { return servers[i].name.toLowerCase(); }), srvs = [];
			serverlist.forEach(i => {
				if (servers[i] && servers[i].guildid == message.guild.id && servers[i].link) srvs.push(servers[i]);
			});
			if (!srvs[0]) return;
			const LinkEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('DISCORD LINKING')
				.setDescription(`**Follow these steps to link your Discord and Minecraft accounts**
**1.** If you are not already on the server, join it.
**2.** Use the command \`/discord link\` in-game.
**3.** Click here -> <@${srvs[0].link.botid}>
**4.** Enter the 4 digit code in the box that reads \`Message @${srvs[0].link.botname}\`
**5.** Hit enter. Your account should now be linked!

**Having Trouble?**
If after step 3, you do not see a box that says \`Message @${srvs[0].link.botname}\`, you disabled direct messages from server members. To turn this back on, follow the steps below:
**1.** On your list of Discord servers in the left-hand servers tab, you should see the ${srvs[0].name} logo. Right click it.
**2.** Click Privacy \`Settings\`
**3.** Enable the setting labeled \`Allow direct messages from server members\`.`);
			const row = new ActionRow()
				.addComponents(
					new ButtonComponent()
						.setCustomId('create_ticket')
						.setLabel('Still have an issue? Create a ticket by clicking here!')
						.setStyle(ButtonStyle.Secondary),
				);
			message.reply({ embeds: [LinkEmbed], components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};
