const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get pup invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const Embed = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.addField('**Add Cactie Bot to your server:**', '[Invite Cactie to your server using this link!](https://cactie.smhsmh.club/invite)')
				.addField('**Add the secondary Cactie Dev Bot:**', '[Invite Cactie Dev to your server using this link!](https://cactie.smhsmh.club/dev)')
				.addField('**Bot Support:**', '[Join Cactie\'s discord server!](https://cactie.smhsmh.club/discord)')
				.addField('**Nether Depths:**', '[Also check out Nether Depths!](https://netherdepths.com/discord)');
			await message.reply({ embeds: [Embed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};