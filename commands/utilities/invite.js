const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Get Cactie\'s invite links',
	aliases: ['inv'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const InvEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Want to invite this bot to your server?')
				.setDescription('Use the buttons below!');
			const row1 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club/invite')
						.setLabel('Invite Cactie to your server!')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club/support/discord')
						.setLabel('Join the support server!')
						.setStyle(ButtonStyle.Link),
				]);
			const row2 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL('https://netherdepths.com')
						.setLabel('Also check out Nether Depths!')
						.setStyle(ButtonStyle.Link),
				]);
			await message.reply({ embeds: [InvEmbed], components: [row1, row2] });
		}
		catch (err) { client.error(err, message); }
	},
};