const { EmbedBuilder } = require('discord.js');

module.exports = async function manageUsers(client, member, channel, targetMember, add = false) {
	// Check if channel is thread and set the channel to the parent channel
	if (channel.isThread()) channel = channel.parent;

	// Check if channel is a ticket
	const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${channel.id}'`))[0];
	if (!ticketData) throw new Error('This isn\'t a ticket that I know of!');
	if (ticketData.users) ticketData.users = ticketData.users.split(',');

	// Check if ticket is closed
	if (channel.name.startsWith('closed')) throw new Error('This ticket is closed!');

	// Check if user is already in the ticket, if not, add them to the ticket data
	if (add && ticketData.users.includes(targetMember.id)) throw new Error('This user has already been added!');
	else if (!add && !ticketData.users.includes(targetMember.id)) throw new Error('This user isn\'t added!');
	add ? ticketData.users.push(targetMember.id) : ticketData.users.splice(ticketData.users.indexOf(targetMember.id), 1);
	client.setData('ticketdata', { channelId: channel.id }, { users: ticketData.users.join(',') });

	// If the ticket has a voiceticket, give permissions to the user there
	if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
		const voiceticket = await member.guild.channels.fetch(ticketData.voiceticket).catch(() => { return null; });
		if (voiceticket) voiceticket.permissionOverwrites.edit(targetMember.id, { ViewChannel: add });
	}

	// Give permissions to the user and reply
	channel.permissionOverwrites.edit(targetMember.id, { ViewChannel: add });
	const AddEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setDescription(add ? `${member} added ${targetMember} to the ticket` : `${member} removed ${targetMember} from the ticket`);
	await channel.send({ embeds: [AddEmbed] });
	logger.info(add ? `Added ${targetMember.user.tag} to #${channel.name}` : `Removed ${targetMember.user.tag} from #${channel.name}`);

	// Return message
	return `**${add ? 'Added' : 'Removed'} ${targetMember} ${add ? 'to' : 'from' } the ticket**`;
};