const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../getTranscript.js');
module.exports = async function deleteTicket(client, srvconfig, member, channel, force) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel.isThread()) channel = channel.parent;

	// Check if channel is a ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Check if ticket is open
	if (!force && channel.name.startsWith('ticket')) throw new Error('This ticket needs to be closed first!');

	// Get the ticket log channel
	const logchannel = await member.guild.channels.fetch(srvconfig.ticketlogchannel).catch(() => { return null; });

	// Check if ticket log channel is set in settings
	if (logchannel) {
		// Get transcript of ticket
		await channel.send({ content: 'Creating transcript...' });
		const messages = await channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);

		// Create embed
		const DelEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`Deleted ${channel.name}`)
			.addFields([
				{ name: '**Transcript**', value: `${link}` },
				{ name: '**Deleted by**', value: `${member}` },
			]);
		if (ticketData.users.length) DelEmbed.addFields([{ name: '**Users in ticket**', value: `${ticketData.users.map(u => { return `<@${u}>`; }).join(', ')}` }]);

		// Send embed to ticket log channel
		await logchannel.send({ embeds: [DelEmbed] });
		logger.info(`Created transcript of ${channel.name}: ${link}`);
	}

	// Actually delete ticket and ticket database
	await client.delData('ticketdata', 'channelId', channel.id);
	logger.info(`Deleted ticket #${channel.name}`);
	await channel.delete();
	return '**Ticket deleted successfully!**';
};