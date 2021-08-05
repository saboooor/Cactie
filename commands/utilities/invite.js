const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get pup invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message) {
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.addField('**Add the bot:**', '[Invite Pup to your server using this link!](https://pup.smhsmh.club/invite)')
			.addField('**Add the bot (Admin):**', '[Invite Pup to your server using this link!](https://pup.smhsmh.club/admin)')
			.addField('**Bot Support:**', '[Join Pup\'s discord server!](https://pup.smhsmh.club/invite)')
			.addField('**Nether Depths:**', '[Also check out Nether Depths!](https://netherdepths.com/invite)');
		await message.reply({ embeds: [Embed] });
	},
};