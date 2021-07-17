const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get pup invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.addField('**Add the bot:**', '[Invite Pup to your server using this link!](https://discord.com/api/oauth2/authorize?client_id=765287593762881616&permissions=2416307446&scope=applications.commands%20bot)')
			.addField('**Add the bot (Admin):**', '[Invite Pup to your server using this link!](https://discord.com/api/oauth2/authorize?client_id=765287593762881616&permissions=8&scope=bot%20applications.commands)')
			.addField('**Bot Support:**', '[Join Pup\'s discord server!](https://discord.gg/Bsefgbaedz)');
		if (srvconfig.adfree == 'false') Embed.addField('**Nether Depths:**', '[Also check out Nether Depths!](https://discord.gg/g7hSukX)');
		await message.reply({ embeds: [Embed] });
	},
};