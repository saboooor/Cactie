const { PermissionsBitField } = require('discord.js');

module.exports = function checkPerms(perms, member, channel) {
	// If member is owner, override
	if (member.id == '249638347306303499') return;

	// Create array of the rejected perms
	const rejectedPerms = [];

	// Get the channel from the snowflake if a full channel isn't given
	if (channel && !channel.id) channel = member.guild.channels.cache.get(channel);

	// Check perms of channel if channel is defined, otherwise check of server
	if (channel) perms.forEach(perm => { if (!member.permissionsIn(channel).has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm); });
	else perms.forEach(perm => { if (!member.permissions.has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm); });

	// Check if there are any rejected perms
	if (!rejectedPerms.length) return;
	return `${member.displayName} has missing permissions${channel ? ` in #${channel.name}` : ''}: ${rejectedPerms.join(', ')}`;
};