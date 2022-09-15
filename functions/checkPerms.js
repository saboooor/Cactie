const { PermissionsBitField } = require('discord.js');

module.exports = function checkPerms(reqPerms, member, channel) {
	// If member is owner, override
	if (member.id == '249638347306303499') return;

	// Create array of the rejected perms
	const rejectedPerms = [];

	// Get the channel from the snowflake if a full channel isn't given
	if (channel && !channel.id) channel = member.guild.channels.cache.get(channel);

	// Attempt to get perms
	let perms = member.permissions;
	if (channel) {
		try { perms = member.permissionsIn(channel); }
		catch { perms = null; }
		if (!perms) {
			try { perms = member.permissionsIn(channel.parent); }
			catch { perms = null; }
		}
		if (!perms) perms = member.permissions;
	}

	// Check if perms are met
	reqPerms.forEach(perm => {
		if (!perms.has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm);
	});

	// Check if there are any rejected perms
	if (!rejectedPerms.length) return;
	return `${member.displayName} has missing permissions${channel ? ` in #${channel.name}` : ''}: ${rejectedPerms.join(', ')}`;
};