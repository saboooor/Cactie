const { PermissionsBitField } = require('discord.js');

module.exports = function checkPerms(perms, member, channel) {
	if (member.id == '249638347306303499') return;
	const rejectedPerms = [];
	if (channel) perms.forEach(perm => { if (!member.permissionsIn(channel).has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm); });
	else perms.forEach(perm => { if (!member.permissions.has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm); });
	if (!rejectedPerms.length) return;
	return `${member.displayName} has missing permissions${channel ? ` in #${channel.name}` : ''}: ${rejectedPerms.join(', ')}`;
};