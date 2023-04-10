import { EmbedBuilder, Client, GuildMember, TextChannel } from 'discord.js';
import { leave } from '../../misc/emoji.json';

export default async (client: Client, member: GuildMember) => {
	// Get current settings for the guild
	const srvconfig = await sql.getData('settings', { guildId: member.guild.id });

	// Check if log is enabled and send log
	if (!['memberleave', 'member', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = member.guild.channels.cache.get(srvconfig.logchannel) as TextChannel;
	if (!logchannel) return;

	// Convert createdTimestamp into seconds
	const createdTimestamp = Math.round(member.user.createdTimestamp / 1000);

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: member.user?.tag ?? 'Unknown User', iconURL: member.user?.avatarURL() ?? undefined })
		.setTitle(`<:out:${leave}> Member left`)
		.setFields([
			{ name: 'User', value: `${member}`, inline: true },
			{ name: 'Created Account at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
		]);

	// Add joined server at if exists
	if (member.joinedTimestamp) logEmbed.addFields([{ name: 'Joined Server at', value: `<t:${Math.round(member.joinedTimestamp / 1000)}>\n<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true }]);

	// Create list of roles and add to log if there are any
	const roles = Array.from(member.roles.cache).sort(function(a, b) {
		if (b[1].rawPosition < a[1].rawPosition) return -1;
		if (b[1].rawPosition > a[1].rawPosition) return 1;
		return 0;
	});
	let roleslist = Object.keys(roles).map(i => { return `${roles[i as any][1]}`; });
	if (roles.length > 50) roleslist = ['Too many roles to list'];
	if (roles.length) logEmbed.addFields([{ name: 'Roles', value: roleslist.join(', ') }]);

	// Send log
	logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};