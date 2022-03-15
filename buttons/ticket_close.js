function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'close_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Get ticket database
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already closed
			if (interaction.channel.name.startsWith(`closed${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-`)) return interaction.reply({ content: 'This ticket is already closed!' });

			// Check if user is ticket author
			const author = interaction.user;
			if (author.id != ticketData.opener) return interaction.reply({ content: 'You can\'t close this ticket!' });

			// Change channel name to closed
			interaction.channel.setName(interaction.channel.name.replace('ticket', 'closed'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (interaction.channel.name.startsWith(`ticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-`)) return interaction.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });

			// Check if there's a voice ticket and delete it
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = interaction.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.delete();
				await client.setData('ticketdata', 'channelId', interaction.channel.id, 'voiceticket', 'false');
			}

			// Reset resolved state
			await client.setData('ticketdata', 'channelId', interaction.channel.id, 'resolved', 'false');

			// Remove permissions for each user in the ticket
			ticketData.users.forEach(userid => { interaction.channel.permissionOverwrites.edit(interaction.guild.members.cache.get(userid).user, { ViewChannel: false }); });

			// Get the transcript
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);

			// Get users and dm them all with ticket close embed
			const users = [];
			await ticketData.users.forEach(userid => users.push(interaction.guild.members.cache.get(userid).user));
			const CloseDMEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${interaction.channel.name}`)
				.addFields({ name: '**Users in ticket**', value: `${users}` })
				.addFields({ name: '**Transcript**', value: `${link}.txt` })
				.addFields({ name: '**Closed by**', value: `${author}` });
			users.forEach(usr => { usr.send({ embeds: [CloseDMEmbed] }); });

			// Reply with ticket close message
			const CloseEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`Ticket Closed by ${author}`);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('delete_ticket')
						.setLabel('Delete Ticket')
						.setEmoji({ name: '⛔' })
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId('reopen_ticket')
						.setLabel('Reopen Ticket')
						.setEmoji({ name: '🔓' })
						.setStyle(ButtonStyle.Primary),
				);
			interaction.reply({ embeds: [CloseEmbed], components: [row] });
			client.logger.info(`Closed ticket #${interaction.channel.name}`);
		}
		catch (err) { client.error(err, interaction); }
	},
};