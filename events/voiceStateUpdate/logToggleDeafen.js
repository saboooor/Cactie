const { EmbedBuilder } = require('discord.js');
const { deafen, srvdeafen, undeafen } = require('../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Check if the deaf state actually changed
	if (oldState.selfDeaf == newState.selfDeaf && oldState.serverDeaf == newState.serverDeaf) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', newState.guild.id);

	// Check if log is enabled
	if (!['voicedeafen', 'voice', 'other', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
	const logchannel = newState.guild.channels.cache.get(srvconfig.logchannel);
	if (!logchannel) return;

	// Create log embed
	const logEmbed = new EmbedBuilder()
		.setColor(0x2f3136)
		.setAuthor({ name: newState.member.user.tag, iconURL: newState.member.user.avatarURL() })
		.setFields([
			{ name: 'Member', value: `${newState.member}`, inline: true },
			{ name: 'Channel', value: `${newState.channel}`, inline: true },
		]);

	// Check if the user undeafened or deafened and set title accordingly
	if (!oldState.selfDeaf && newState.selfDeaf) logEmbed.setTitle(`<:deafen:${deafen}> Member deafened`);
	else if (oldState.selfDeaf && !newState.selfDeaf) logEmbed.setTitle(`<:undeafen:${undeafen}> Member undeafened`);
	else if (!oldState.serverDeaf && newState.serverDeaf) logEmbed.setTitle(`<:srvdeafen:${srvdeafen}> Member server-deafened`);
	else if (oldState.serverDeaf && !newState.serverDeaf) logEmbed.setTitle(`<:undeafen:${undeafen}> Member server-undeafened`);
	else logEmbed.setTitle('logToggleDeafen');

	// Send log
	logchannel.send({ embeds: [logEmbed] }).catch(err => client.logger.error(err));
};