import { PermissionsBitField, GuildMember, TextChannel, GuildChannelResolvable, GuildChannel } from 'discord.js';

export default function checkPerms(reqPerms: (keyof typeof PermissionsBitField.Flags)[], member: GuildMember, channel?: GuildChannelResolvable) {
  // If member is owner, override
  if (member.id == '249638347306303499') return;

  // Create array of the rejected perms
  const rejectedPerms: typeof reqPerms = [];

  // Get the channel from the snowflake if a full channel isn't given
  if (channel && typeof channel == 'string') channel = member.guild.channels.cache.get(channel) as TextChannel;

  // Attempt to get perms
  let perms: null | PermissionsBitField = member.permissions;
  if (channel) {
    try { perms = member.permissionsIn(channel); }
    catch { perms = null; }
    if (!perms && channel instanceof TextChannel) {
      try { perms = channel.parent ? member.permissionsIn(channel.parent.id) : null; }
      catch { perms = null; }
    }
    if (!perms) perms = member.permissions;
  }

  // Check if perms are met
  reqPerms.forEach(perm => {
    if (!perms!.has(PermissionsBitField.Flags[perm])) rejectedPerms.push(perm);
  });

  // Check if there are any rejected perms
  if (!rejectedPerms.length) return;
  return `${member.displayName} has missing permissions${channel ? ` in #${(channel as GuildChannel).name}` : ''}: ${rejectedPerms.join(', ')}`;
}