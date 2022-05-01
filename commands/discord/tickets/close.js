function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const getTranscript = require('../../../functions/getTranscript.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	botperm: 'ManageChannels',
	async execute(message, user, client, lang, reaction) {
		try {
			// Set author to command sender
			let author = message.member.user;

			// If this command is being used as a reaction:
			// return if the message isn't a ticket panel
			// set author to args, which is the reaction user
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = user;
			}

			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.isThread() ? message.channel.parent.id : message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// If the channel is a subticket, delete the subticket instead
			if (message.channel.isThread()) {
				// Fetch the messages of the channel and get the transcript
				const messages = await message.channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);
				client.logger.info(`Created transcript of ${message.channel.name}: ${link}`);

				// Create embed and send it to the main ticket channel
				const CloseEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Deleted ${message.channel.name}`)
					.addFields([
						{ name: '**Transcript**', value: `${link}` },
						{ name: '**Deleted by**', value: `${message.member.user}` },
					]);
				message.channel.parent.send({ embeds: [CloseEmbed] }).catch(err => client.logger.error(err.stack));

				// Log and delete the thread
				client.logger.info(`Deleted subticket #${message.channel.name}`);
				return message.channel.delete();
			}

			// Check if ticket is already closed
			if (message.channel.name.startsWith('closed')) return client.error('This ticket is already closed!', message, true);

			// Check if user is a user that has been added with -add
			if (ticketData.users.includes(author.id) && author.id != ticketData.opener) return client.error('You can\'t close this ticket!', message, true);

			// Set the name to closed
			message.channel.setName(message.channel.name.replace('ticket', 'closed'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (message.channel.name.startsWith('ticket')) return client.error('Failed to close ticket, please try again in 10 minutes.', message, true);

			// If voiceticket is set, delete the voiceticket
			if (ticketData.voiceticket !== 'false') {
				const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.delete();
				await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', 'false');
			}

			// Unresolve ticket
			await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'false');

			// Get all the users and get rid of their permissions
			const users = [];
			await ticketData.users.forEach(userid => {
				message.channel.permissionOverwrites.edit(userid, { ViewChannel: false });
				const ticketmember = message.guild.members.cache.get(userid);
				if (ticketmember) users.push(ticketmember);
			});

			// Create a transcript of the ticket
			const messages = await message.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			client.logger.info(`Created transcript of ${message.channel.name}: ${link}`);

			// Send the embed to all the users' DMs
			const CloseDMEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${message.channel.name}`)
				.addFields([
					{ name: '**Transcript**', value: `${link}` },
					{ name: '**Closed by**', value: `${author}` },
				]);
			if (users[0]) CloseDMEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);
			users.forEach(usr => {
				usr.send({ embeds: [CloseDMEmbed] })
					.catch(err => client.logger.warn(err));
			});

			// Create embed
			const CloseEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`Ticket Closed by ${author}`);

			// If the ticket mode is set to buttons, add the buttons, if not, don't
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.tickets == 'buttons') {
				const row = new ActionRowBuilder()
					.addComponents([
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
					]);
				message.reply({ embeds: [CloseEmbed], components: [row] });
			}
			else {
				message.reply({ embeds: [CloseEmbed] });
			}

			// Add reaction panel if ticket mode is set to reactions
			if (srvconfig.tickets == 'reactions') {
				CloseEmbed.setColor(0x5662f6)
					.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
				const Panel = await message.channel.send({ embeds: [CloseEmbed] });
				Panel.react('🔓');
				Panel.react('⛔');
			}

			// Log
			client.logger.info(`Closed ticket #${message.channel.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};