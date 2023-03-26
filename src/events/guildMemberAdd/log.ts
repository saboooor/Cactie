import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { join } from '../../lang/int/emoji.json';

export default async (client: Client, member: GuildMember) => {
	// Get current settings for the guild
	const srvconfig = await sql.getData('settings', { guildId: member.guild.id });

	// Check if log is enabled and send log
	if (!['memberjoin', 'member', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = member.guild.channels.cache.get(srvconfig.logchannel) as TextChannel;
	if (!logchannel) return;

	// Convert createdTimestamp into seconds
	const createdTimestamp = Math.round(member.user.createdTimestamp / 1000);

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: member.user?.tag ?? 'Unknown User', iconURL: member.user?.avatarURL() ?? undefined })
		.setTitle(`<:in:${join}> Member joined`)
		.setFields([
			{ name: 'User', value: `${member}`, inline: true },
			{ name: 'Created Account at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
		]);

	// Send log
	logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};