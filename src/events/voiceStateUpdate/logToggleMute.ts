import { Client, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import { mute, srvmute, unmute } from '../../misc/emoji.json';

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
	// Check if the mute state actually changed
	if (oldState.selfMute == newState.selfMute && oldState.serverMute == newState.serverMute) return;

	// Get current settings for the guild
	const srvconfig = await sql.getData('settings', { guildId: newState.guild.id });

	// Check if log is enabled
	if (!['voicemute', 'voice', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel) as TextChannel;
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: newState.member?.user.tag ?? 'Unknown User', iconURL: newState.member?.user.avatarURL() ?? undefined })
		.setFields([
			{ name: 'Member', value: `${newState.member}`, inline: true },
			{ name: 'Channel', value: `${newState.channel}`, inline: true },
		]);

	// Check if the user unmuted or muted and set title accordingly
	if (!oldState.selfMute && newState.selfMute) logEmbed.setTitle(`<:mute:${mute}> Member muted`);
	else if (oldState.selfMute && !newState.selfMute) logEmbed.setTitle(`<:unmute:${unmute}> Member unmuted`);
	else if (!oldState.serverMute && newState.serverMute) logEmbed.setTitle(`<:srvmute:${srvmute}> Member server-muted`);
	else if (oldState.serverMute && !newState.serverMute) logEmbed.setTitle(`<:unmute:${unmute}> Member server-unmuted`);
	else return;

	// Send log
	logchannel.send({ embeds: [logEmbed] }).catch(err => logger.error(err));
};