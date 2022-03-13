function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'subticket_create',
	botperm: 'CreatePublicThreads',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket has more than 5 subtickets
			if (interaction.channel.threads.cache.size > 5) return interaction.reply({ content: 'This ticket has too many subtickets!' });

			// Check if ticket is closed
			if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });

			// Create Thread for subticket
			const subticket = await interaction.channel.threads.create({
				name: `Subticket${client.user.username.replace('Pup', '') + ' '}${interaction.channel.threads.cache.size + 1}`,
				autoArchiveDuration: 1440,
				reason: 'Created with a button',
			});
			client.logger.info(`Subticket created at #${subticket.name}`);
			interaction.reply({ content: `Subticket created at #${subticket}!` });
			await sleep(1000);

			// Get users and ping them all with subticket embed
			const users = [];
			await ticketData.users.forEach(userid => users.push(interaction.guild.members.cache.get(userid).user));
			const CreateEmbed = new EmbedBuilder()
				.setColor(0x5662f6)
				.setTitle('Subticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly.')
				.addFields({ name: 'Description', value: 'Created with a button' });

			// Check if ticket mode is buttons or reactions and do stuff
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.tickets == 'buttons') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or click the button below' });
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('close_subticket')
							.setLabel('Close Subticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
					);
				await subticket.send({ content: `${users}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or react with 🔒' });
				const Panel = await subticket.send({ content: `${users}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
			}
		}
		catch (err) { client.error(err, interaction); }
	},
};
