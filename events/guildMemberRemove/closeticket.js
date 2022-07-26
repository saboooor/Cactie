const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = async (client, member) => {
	// Get the guild settings
	const srvconfig = await client.getData('settings', 'guildId', member.guild.id);

	// Close ticket if user is a user that has created an open ticket
	// Check if ticket is an actual ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${member.id}'`))[0];
	if (!ticketData) return;

	const channel = member.guild.channels.cache.get(ticketData.channelId);

	// Split the list of users into an array cuz mysql dumb
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Check if ticket is already closed
	if (channel.name.startsWith(`closed${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-`)) return;

	// Set the name to closed and check if bot has been rate limited
	channel.setName(channel.name.replace('ticket', 'closed'));
	await sleep(1000);
	if (channel.name.startsWith(`ticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-`)) return channel.send({ content: `${member} has left the server but the ticket closure failed.` });

	// If voiceticket is set, delete the voiceticket
	if (ticketData.voiceticket !== 'false') {
		const voiceticket = member.guild.channels.cache.get(ticketData.voiceticket);
		voiceticket.delete().catch(err => client.logger.warn(err.stack));
		await client.setData('ticketdata', 'channelId', channel.id, 'voiceticket', 'false');
	}

	// Unresolve ticket
	await client.setData('ticketdata', 'channelId', channel.id, 'resolved', 'false');

	// Get all the users and get rid of their permissions
	const users = [];
	await ticketData.users.forEach(userid => {
		channel.permissionOverwrites.edit(userid, { ViewChannel: false });
		const ticketmember = member.guild.members.cache.get(userid);
		if (ticketmember) users.push(ticketmember);
	});

	// Create a transcript of the ticket
	const messages = await channel.messages.fetch({ limit: 100 });
	const link = await getTranscript(messages);
	client.logger.info(`Created transcript of ${channel.name}: ${link}`);

	// Send the embed to all the users' DMs
	const CloseDMEmbed = new EmbedBuilder()
		.setColor('Random')
		.setTitle(`Closed ${channel.name}`)
		.addFields([
			{ name: '**Transcript**', value: `${link}` },
			{ name: '**Cause**', value: `${member} left the server` },
		]);
	if (users.length) CloseDMEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);
	client.logger.info(`Created transcript of ${channel.name}: ${link}`);
	users.forEach(usr => {
		usr.send({ embeds: [CloseDMEmbed] })
			.catch(err => client.logger.warn(err));
	});

	// Create embed
	const CloseEmbed = new EmbedBuilder()
		.setColor(0xFF6400)
		.setDescription(`Ticket Closed because ${member} left the server`);

	// If the ticket mode is set to buttons, add the buttons, if not, don't
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
		channel.send({ embeds: [CloseEmbed], components: [row] });
	}
	else {
		channel.send({ embeds: [CloseEmbed] });
	}

	// Add reaction panel if ticket mode is set to reactions
	if (srvconfig.tickets == 'reactions') {
		CloseEmbed.setColor(0x2f3136)
			.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
		const Panel = await channel.send({ embeds: [CloseEmbed] });
		Panel.react('🔓');
		Panel.react('⛔');
	}

	// Log
	client.logger.info(`Closed ticket #${channel.name} because ticket creator left the server`);
};