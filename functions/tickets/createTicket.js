const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = async function createTicket(client, srvconfig, member, description) {
	// Check if tickets are disabled
	if (srvconfig.tickets == 'false') throw new Error('Tickets are disabled on this server.');

	// Check if ticket already exists
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${member.id}' AND guildId = '${member.guild.id}'`))[0];
	if (ticketData) {
		try {
			const channel = await member.guild.channels.fetch(ticketData.channelId);
			if (channel.startsWith('ticket')) {
				await channel.send({ content: `❗ **${member} Ticket already exists!**` });
				return `**You've already created a ticket at ${channel}!**`;
			}
		}
		catch (err) {
			logger.error(`Ticket data found but can't be fetched: ${err}`);
			client.delData('ticketdata', 'channelId', ticketData.channelId);
		}
	}

	// Find category and if no category then set it to null
	const parent = await member.guild.channels.fetch(srvconfig.ticketcategory).catch(() => { return null; });

	// Branch for ticket-dev or ticket-testing etc
	const branch = client.user.username.split(' ')[1] ? `-${client.user.username.split(' ')[1].toLowerCase()}` : '';

	// Create ticket and set database
	const ticket = await member.guild.channels.create({
		name: `ticket${branch}-${member.displayName.toLowerCase().replace(' ', '-')}`,
		parent: parent ? parent.id : null,
		topic: `Ticket Opened by ${member.user.tag}`,
		permissionOverwrites: [
			{
				id: member.guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel],
			},
			{
				id: client.user.id,
				allow: [PermissionsBitField.Flags.ViewChannel],
			},
			{
				id: member.id,
				allow: [PermissionsBitField.Flags.ViewChannel],
			},
		],
		reason: description,
	});

	// Find role and set perms and if no role then send error
	const role = await member.guild.roles.fetch(srvconfig.supportrole).catch(() => { return null; });
	if (role) await ticket.permissionOverwrites.edit(role.id, { ViewChannel: true });
	else ticket.send({ content: '❗ **No support role set!**\nOnly Administrators can see this ticket.\nTo set a support role, do `/settings` and set the Support Role value' });

	// Set the database
	await client.query(`INSERT INTO ticketdata (guildId, channelId, opener, users) VALUES ('${member.guild.id}', '${ticket.id}', '${member.id}', '${member.id}');`);

	// Create embed
	const CreateEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setTitle('Ticket Created')
		.setDescription('Please explain your issue and we\'ll be with you shortly\nIf you would like to create a private voice channel, use the button below.')
		.addFields({ name: 'Notice', value: 'Messages in this ticket will be transcripted for future reference and sent to the staff and users participating once the ticket is closed.' });

	// Add the description if there is one
	if (description) CreateEmbed.addFields([{ name: 'Description', value: description }]);

	// Ping the staff if enabled
	let ping;
	if (srvconfig.ticketmention == 'here' || srvconfig.ticketmention == 'everyone') ping = `@${srvconfig.ticketmention}`;
	else if (srvconfig.ticketmention != 'false') ping = `<@${srvconfig.ticketmention}>`;

	// If tickets is set to buttons, add buttons, if not, add reactions
	if (srvconfig.tickets == 'buttons') {
		// Set the footer with the close reminder with button
		CreateEmbed.setFooter({ text: 'To close this ticket do /close, or click the button below' });

		// Create button row and send to ticket
		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('close_ticket')
					.setLabel('Close Ticket')
					.setEmoji({ name: '🔒' })
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('voiceticket_create')
					.setLabel('Create Voice channel')
					.setEmoji({ name: '🔊' })
					.setStyle(ButtonStyle.Secondary),
			]);
		await ticket.send({ content: `${member}${ping ?? ''}`, embeds: [CreateEmbed], components: [row] });
	}
	else if (srvconfig.tickets == 'reactions') {
		// Set the footer with the close reminder with reaction
		CreateEmbed.setFooter({ text: 'To close this ticket do /close, or react with 🔒' });

		// Send to ticket and react
		const Panel = await ticket.send({ content: `${member}${ping ?? ''}`, embeds: [CreateEmbed] });
		await Panel.react('🔒');
		await Panel.react('🔊');
	}

	// Resolve with message
	logger.info(`Ticket created at #${ticket.name}`);
	return `**Ticket created at ${ticket}!**`;
};