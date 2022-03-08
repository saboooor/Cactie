const { Embed } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get pup invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const InvEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.addFields({ name: '**Add Pup Bot to your server:**', value: '[Invite Pup to your server using this link!](https://pup.smhsmh.club/invite)' })
				.addFields({ name: '**Add the secondary Pup Dev Bot:**', value: '[Invite Pup Dev to your server using this link!](https://pup.smhsmh.club/dev)' })
				.addFields({ name: '**Bot Support:**', value: '[Join Pup\'s discord server!](https://pup.smhsmh.club/discord)' })
				.addFields({ name: '**Nether Depths:**', value: '[Also check out Nether Depths!](https://netherdepths.com/discord)' });
			await message.reply({ embeds: [InvEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};