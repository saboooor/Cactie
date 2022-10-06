const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Get various information about Cactie',
	aliases: ['information'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			console.log(process);
			const packageJSON = require('../../package.json');
			const InfEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle(client.user.username)
				.setDescription(`\`\`\`${packageJSON.description}\`\`\``)
				.setFields([
					{ name: 'Bot Version', value: `\`\`\`${packageJSON.version}\`\`\``, inline: true },
					{ name: 'NodeJS Version', value: `\`\`\`${process.version}\`\`\``, inline: true },
					{ name: 'Developer', value: `\`\`\`${packageJSON.author} | @${client.users.cache.get('249638347306303499').tag}\`\`\`` },
					{ name: 'Last restart', value: `<t:${Math.ceil(client.startTimestamp / 1000)}:R>` },
				]);
			const row1 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}/invite`)
						.setLabel('Invite Cactie!')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}/support/discord`)
						.setLabel('Join the Cactie Server!')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}`)
						.setLabel('Open the Dashboard!')
						.setStyle(ButtonStyle.Link),
				]);
			const row2 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL('https://netherdepths.com')
						.setLabel('Also check out Nether Depths!')
						.setStyle(ButtonStyle.Link),
				]);
			await message.reply({ embeds: [InfEmbed], components: [row1, row2] });
		}
		catch (err) { client.error(err, message); }
	},
};