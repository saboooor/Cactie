const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');

module.exports = async function closeTicket(client, srvconfig, member, channel) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel.isThread()) channel = channel.parent;

	// Check if channel is a ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Check if ticket is already closed
	if (channel.name.startsWith('closed')) throw new Error('This ticket is already closed!');

	// Check if user is a user that has been added with -add
	if (ticketData.users.includes(member.id) && member.id != ticketData.opener) throw new Error('You can\'t close this ticket!');

	// Set the name to closed
	await channel.setName(channel.name.replace('ticket', 'closed'));

	// Check if bot got rate limited and ticket didn't properly close
	if (channel.name.startsWith('ticket')) throw new Error('This ticket couldn\'t be closed as the bot has been rate limited.\nWait 10 minutes to try again or delete the channel.');

	// If voiceticket is set, delete the voiceticket
	if (ticketData.voiceticket != 'false') {
		const voiceticket = await member.guild.channels.fetch(ticketData.voiceticket).catch(() => { return null; });
		if (voiceticket) voiceticket.delete();
		await client.setData('ticketdata', 'channelId', channel.id, 'voiceticket', 'false');
	}

	// Unresolve ticket
	if (ticketData.resolved != 'false') await client.setData('ticketdata', 'channelId', channel.id, 'resolved', 'false');

	// Create a transcript of the ticket
	const messages = await channel.messages.fetch({ limit: 100 });
	const link = await getTranscript(messages);
	logger.info(`Created transcript of ${channel.name}: ${link}`);

	// Create embed for DMs
	const CloseEmbed = new EmbedBuilder()
		.setColor('Random')
		.setTitle(`Closed ${channel.name}`)
		.addFields([
			{ name: '**Transcript**', value: `${link}` },
			{ name: '**Closed by**', value: `${member}` },
		]);
	if (ticketData.users.length) CloseEmbed.addFields([{ name: '**Users in ticket**', value: `${ticketData.users.map(u => { return `<@${u}>`; }).join(', ')}` }]);

	// Get all the users and get rid of their permissions
	for (const userid of ticketData.users) {
		await channel.permissionOverwrites.edit(userid, { ViewChannel: false });
		const ticketmember = await member.guild.members.fetch(userid).catch(() => { return null; });
		if (!ticketmember) continue;
		await ticketmember.send({ embeds: [CloseEmbed] }).catch(err => logger.warn(err));
	}

	// Get the ticket log channel
	const logchannel = await member.guild.channels.fetch(srvconfig.ticketlogchannel).catch(() => { return null; });

	// Check if ticket log channel is set in settings and send embed to ticket log channel
	if (logchannel) await logchannel.send({ embeds: [CloseEmbed] });

	CloseEmbed.addFields([{ name: '**Notice**', value: 'Any messages after this will not be transcripted unless the ticket is re-opened.' }]);

	// If the ticket mode is set to buttons, add the buttons
	// Add reaction panel if ticket mode is set to reactions
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
		await channel.send({ embeds: [CloseEmbed], components: [row] });
	}
	else {
		CloseEmbed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
		const Panel = await channel.send({ embeds: [CloseEmbed] });
		await Panel.react('🔓');
		await Panel.react('⛔');
	}

	// Log
	logger.info(`Closed ticket #${channel.name}`);
	return '**Ticket closed successfully!**';
};