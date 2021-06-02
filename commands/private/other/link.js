module.exports = {
	name: 'link',
	description: 'Get help on DiscordSRV linking',
	cooldown: 10,
	async execute(message, args, client, Client, Discord) {
		let e = [];
		if (message.guild.id == '661736128373719141') e = ['Warden', '661797951223627787', 'Nether Depths'];
		if (message.guild.id == '711661870926397601') e = ['Taco\'s Turtle Bot', '743741294190395402', 'Taco Haven'];
		if (!e[0]) return;
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('DISCORD LINKING')
			.setDescription(`**Follow these steps to link your Discord and Minecraft accounts**
**1.** If you are not already on the server, join it.
**2.** Use the command \`/discord link\` in-game.
**3.** Click here -> <@${e[1]}>
**4.** Enter the 4 digit code in the box that reads \`Message @${e[0]}\`
**5.** Hit enter. Your account should now be linked!

**Having Trouble?**
If after step 3, you do not see a box that says \`Message @${e[0]}\`, you disabled direct messages from server members. To turn this back on, follow the steps below:
**1.** On your list of Discord servers in the left-hand servers tab, you should see the ${e[2]} logo. Right click it.
**2.** Click Privacy \`Settings\`
**3.** Enable the setting labeled \`Allow direct messages from server members\`.`);
		message.channel.send(Embed);
	},
};
