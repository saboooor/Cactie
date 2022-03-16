function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'ticket_create',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });

			// Check if ticket already exists
			const author = interaction.user;
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${author.id}' AND guildId = '${interaction.guild.id}'`))[0];
			if (ticketData) {
				const channel = interaction.guild.channels.cache.get(ticketData.channelId);
				channel.send({ content: `❗ **${author} Ticket already exists!**` });
				return interaction.reply({ content: `You've already created a ticket at ${channel}!` });
			}

			// Find category and if no category then set it to null
			let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
			if (!parent) parent = { id: null };
			else if (!parent.isCategory()) parent = { id: null };

			// Find role and if no role then reply with error
			const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
			if (!role) return interaction.reply({ content: 'You need to set a role with /settings supportrole <Role Id>!' });

			// Create ticket and set database
			const ticket = await interaction.guild.channels.create(`ticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-${author.username.toLowerCase().replace(' ', '-')}`, {
				parent: parent.id,
				topic: `Ticket Opened by ${author.tag}`,
				permissionOverwrites: [
					{
						id: interaction.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessagesInThreads],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessagesInThreads],
					},
					{
						id: author.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: role.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			});
			await client.query(`INSERT INTO ticketdata (guildId, opener, users) VALUES ('${interaction.guild.id}', '${author.id}', '${author.id}');`);
			interaction.reply({ content: `Ticket created at ${ticket}!` });
			client.logger.info(`Ticket created at #${ticket.name}`);

			// Create embed
			await sleep(1000);
			const CreateEmbed = new EmbedBuilder()
				.setColor(0x5662f6)
				.setTitle('Ticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly\nIf you have multiple issues, please use the /subticket command\nIf you want to create a private voice chat, please use the /voiceticket command\n\nMessages will be transcripted for future reference and are sent to the staff and people participating in the ticket.')
				.addFields({ name: 'Description', value: interaction.fields.getTextInputValue('description') })
				.setFooter({ text: 'To close this ticket do /close, or click the button below' });

			// Create buttons
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('close_ticket')
						.setLabel('Close Ticket')
						.setEmoji({ name: '🔒' })
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId('subticket_create')
						.setLabel('Create Subticket')
						.setEmoji({ name: '📜' })
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('voiceticket_create')
						.setLabel('Create Voiceticket')
						.setEmoji({ name: '🔊' })
						.setStyle(ButtonStyle.Secondary),
				);

			// Ping the staff if enabled
			let ping = null;
			if (srvconfig.ticketmention == 'here' || srvconfig.ticketmention == 'everyone') ping = `@${srvconfig.ticketmention}`;
			else if (srvconfig.ticketmention != 'false') ping = `<@${srvconfig.ticketmention}>`;

			// Send panel to ticket channel
			await ticket.send({ content: `${author}${ping ? ping : ''}`, embeds: [CreateEmbed], components: [row] });
		}
		catch (err) { client.error(err, interaction); }
	},
};