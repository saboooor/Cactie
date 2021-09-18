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
			.addField('**Add the experimental Music Bot:**', '[Invite Pup Music to your server using this link!](https://pup.smhsmh.club/canary)')
			.addField('**Bot Support:**', '[Join Pup\'s discord server!](https://pup.smhsmh.club/discord)')
			.addField('**Nether Depths:**', '[Also check out Nether Depths!](https://netherdepths.com/discord)');
		await message.reply({ embeds: [Embed] });
	},
};