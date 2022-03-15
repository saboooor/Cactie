const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get Cactie\'s invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const InvEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.addFields({ name: '**Add Cactie Bot to your server:**', value: '[Invite Cactie to your server using this link!](https://cactie.smhsmh.club/invite)' })
				.addFields({ name: '**Add the secondary Cactie Dev Bot:**', value: '[Invite Cactie Dev to your server using this link!](https://cactie.smhsmh.club/dev)' })
				.addFields({ name: '**Bot Support:**', value: '[Join Cactie\'s discord server!](https://cactie.smhsmh.club/discord)' })
				.addFields({ name: '**Nether Depths:**', value: '[Also check out Nether Depths!](https://netherdepths.com/discord)' });
			await message.reply({ embeds: [InvEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};