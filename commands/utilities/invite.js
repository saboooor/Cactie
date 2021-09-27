const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get pup invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message) {
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.addField('**Add Pup Bot to your server:**', '[Invite Pup to your server using this link!](https://pup.smhsmh.club/invite)')
			.addField('**Add the secondary Pup Dev Bot:**', '[Invite Pup Dev to your server using this link!](https://pup.smhsmh.club/dev)')
			.addField('**Bot Support:**', '[Join Pup\'s discord server!](https://pup.smhsmh.club/discord)')
			.addField('**Nether Depths:**', '[Also check out Nether Depths!](https://netherdepths.com/discord)');
		await message.reply({ embeds: [Embed] });
	},
};