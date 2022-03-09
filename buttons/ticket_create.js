function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonComponent, ButtonStyle, ActionRow, Embed, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'create_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	ephemeral: true,
	// noDefer: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });

			// Find category and if no category then set it to null
			let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
			if (!parent) parent = { id: null };
			else if (!parent.isCategory()) parent = { id: null };

			// Find role and if no role then reply with error
			const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
			if (!role) return interaction.reply({ content: 'You need to set a role with /settings supportrole <Role Id>!' });

			// Check if ticket already exists
			const author = interaction.user;
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${author.id}' AND guildId = '${interaction.guild.id}'`))[0];
			if (ticketData) {
				const channel = interaction.guild.channels.cache.get(ticketData.channelId);
				channel.send({ content: `❗ **${author} Ticket already exists!**` });
				return interaction.reply({ content: `You've already created a ticket at ${channel}!` });
			}

			// const modal = new Modal()
			//	.setTitle('Create Ticket')
			//	.setCustomId('ticket_create_modal');
			// modal.addComponents(
			//	new ActionRow().addComponents(
			//		new TextInputComponent()
			//			.setCustomId('modal_long_text')
			//			.setLabel('To open a ticket, please explain your issue.')
			//			.setStyle(TextInputStyle.Paragraph),
			//		),
			//	);
			// return interaction.showModal(modal);

			// Create ticket and set database
			const ticket = await interaction.guild.channels.create(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`, {
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
			await client.setData('ticketdata', 'channelId', ticket.id, 'opener', author.id);
			await client.setData('ticketdata', 'channelId', ticket.id, 'guildId', interaction.guild.id);
			await client.setData('ticketdata', 'channelId', ticket.id, 'users', author.id);
			interaction.reply({ content: `Ticket created at ${ticket}!` });
			client.logger.info(`Ticket created at #${ticket.name}`);

			// Create embed
			await sleep(1000);
			const CreateEmbed = new Embed()
				.setColor(0x5662f6)
				.setTitle('Ticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly\nIf you have multiple issues, please use the /subticket command\nIf you want to create a private voice chat, please use the /voiceticket command\n\nMessages will be transcripted for future reference and are sent to the staff and people participating in the ticket.');

			// Check if ticket mode is buttons or reactions and send embed
			if (srvconfig.tickets == 'buttons') {
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or click the button below' });
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('close_ticket')
							.setLabel('Close Ticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
						new ButtonComponent()
							.setCustomId('subticket_create')
							.setLabel('Create Subticket')
							.setEmoji({ name: '📜' })
							.setStyle(ButtonStyle.Primary),
						new ButtonComponent()
							.setCustomId('voiceticket_create')
							.setLabel('Create Voiceticket')
							.setEmoji({ name: '🔊' })
							.setStyle(ButtonStyle.Secondary),
					);
				await ticket.send({ content: `${author}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or react with 🔒' });
				const Panel = await ticket.send({ content: `${author}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
				await Panel.react('📜');
				await Panel.react('🔊');
			}

			// Ping with the ticketmention setting if enabled
			if (srvconfig.ticketmention != 'false') {
				let ping = null;
				if (srvconfig.ticketmention == 'here') ping = await ticket.send({ content: '@here' });
				else if (srvconfig.ticketmention == 'everyone') ping = await ticket.send({ content: '@everyone' });
				else ping = await ticket.send({ content: `<@&${srvconfig.ticketmention}>` });
				await ping.delete();
			}
		}
		catch (err) { client.error(err, interaction); }
	},
};