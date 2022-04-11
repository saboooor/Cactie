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
			if (!ticketData) return client.error('Could not find this ticket in the database, please manually delete this channel.', interaction, true);
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already closed
			if (interaction.channel.name.startsWith('closed')) return client.error('This ticket is already closed!', interaction, true);

			// Check if user is ticket author
			if (interaction.user.id != ticketData.opener) return client.error('You can\'t close this ticket!', interaction, true);

			// Change channel name to closed
			interaction.channel.setName(interaction.channel.name.replace('ticket', 'closed'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (interaction.channel.name.startsWith('ticket')) return client.error('Failed to close ticket, please try again in 10 minutes.', interaction, true);

			// Check if there's a voice ticket and delete it
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = interaction.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.delete();
				await client.setData('ticketdata', 'channelId', interaction.channel.id, 'voiceticket', 'false');
			}

			// Reset resolved state
			await client.setData('ticketdata', 'channelId', interaction.channel.id, 'resolved', 'false');

			// Get all the users and get rid of their permissions
			const users = [];
			await ticketData.users.forEach(userid => {
				interaction.channel.permissionOverwrites.edit(userid, { ViewChannel: false });
				const ticketmember = interaction.guild.members.cache.get(userid);
				if (ticketmember) users.push(ticketmember);
			});

			// Create a transcript of the ticket
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);

			// Send the embed to all the users' DMs
			const CloseDMEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${interaction.channel.name}`)
				.addFields({ name: '**Transcript**', value: `${link}.txt` })
				.addFields({ name: '**Closed by**', value: `${interaction.user}` });
			if (users[0]) CloseDMEmbed.addFields({ name: '**Users in ticket**', value: `${users}` });
			users.forEach(usr => {
				usr.send({ embeds: [CloseDMEmbed] })
					.catch(err => client.logger.warn(err));
			});

			// Reply with ticket close message
			const CloseEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`Ticket Closed by ${interaction.user}`);
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

			// Log
			client.logger.info(`Closed ticket #${interaction.channel.name}`);
		}
		catch (err) { client.error(err, interaction); }
	},
};