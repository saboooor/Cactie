import { Client, EmbedBuilder, GuildMember, TextChannel, VoiceChannel } from 'discord.js';

export default async (client: Client, channel: TextChannel) => {
	// Check if ticket is an actual ticket;
	const ticketData = await sql.getData('ticketdata', { channelId: channel.id }, { nocreate: true });
	if (!ticketData) return;
	const ticketDataUsers = ticketData.users.split(',');

	// Check if ticket log channel is set in settings
	const srvconfig = await sql.getData('settings', { guildId: channel.guild.id });
	const logchannel = channel.guild.channels.cache.get(srvconfig.ticketlogchannel) as TextChannel;
	if (logchannel) {
		// Get list of users for embed
		const users: GuildMember[] = [];
		await ticketDataUsers.forEach(userid => {
			const ticketmember = channel.guild.members.cache.get(userid);
			if (ticketmember) users.push(ticketmember);
		});

		// Create embed
		const DelEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`Deleted ${channel.name}`)
			.addFields([
				{ name: '**Reason**', value: 'Channel deleted manually' },
			]);
		if (users.length) DelEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);

		// Send embed to ticket log channel
		await logchannel.send({ embeds: [DelEmbed] });
	}

	if (ticketData.voiceticket !== 'false') {
		const voiceticket = channel.guild.channels.cache.get(ticketData.voiceticket) as VoiceChannel;
		voiceticket.delete().catch(err => logger.warn(err));
	}
	sql.delData('ticketdata', { channelId: channel.id });
};