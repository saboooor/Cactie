import { EmbedBuilder } from 'discord.js';
import convertTime from '~/functions/music/convert';
import progressbar from '~/functions/music/progressbar';
import { ContextMenuCommand } from '~/types/Objects';

export const context: ContextMenuCommand<'User'> = {
  name: 'User Info',
  ephemeral: true,
  type: 'User',
  async execute(interaction, client, member) {
    try {
      const roles = Array.from(member.roles.cache).sort((a, b) => {
        if (b[1].rawPosition < a[1].rawPosition) return -1;
        if (b[1].rawPosition > a[1].rawPosition) return 1;
        return 0;
      });
      let roleslist = roles.map(role => { return `${role[1]}`; });

      if (roles.length > 50) roleslist = ['Too many roles to list'];
      const activities = member.presence ? member.presence.activities : null;
      let activitieslist: string[] = [];
      if (activities) {
        activitieslist = activities.map(activity => {
          if (activity.name == 'Custom Status') return `**${activity.name}:**\n${activity.emoji ? activity.emoji : ''} ${activity.state ? activity.state : ''}`;
          const activitystack = [`**${activity.name}**`];
          if (activity.details) activitystack.push(`\n${activity.details}`);
          if (activity.state) activitystack.push(`\n${activity.state}`);
          if (activity.timestamps && activity.timestamps.start && activity.timestamps.end) {
            const start = new Date(activity.timestamps.start);
            const current = Number(new Date()) - Number(start);
            const total = Number(new Date(activity.timestamps.end)) - Number(start);
            activitystack.push(`\n\`${convertTime(current)} ${progressbar(total, current, 10, '▬', '🔘')} ${convertTime(total)}\``);
          }
          else if (activity.timestamps && activity.timestamps.start) {
            activitystack.push(`\nStarted <t:${Math.round(Number(activity.timestamps.start) / 1000)}:R>`);
          }
          else if (activity.timestamps && activity.timestamps.end) {
            activitystack.push(`\nEnds <t:${Math.round(Number(activity.timestamps.end) / 1000)}:R>`);
          }
          else if (activity.createdTimestamp) {
            activitystack.push(`\nCreated <t:${Math.round(activity.createdTimestamp / 1000)}:R>`);
          }
          return activitystack.join('');
        });
      }
      member.user = await member.user.fetch();
      const UsrEmbed = new EmbedBuilder()
        .setColor(member.user.accentColor ?? null)
        .setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.username})` : member.user.username}`, iconURL: member.avatarURL() ? member.user.avatarURL() ?? undefined : undefined })
        .setThumbnail(member.avatarURL() ? member.avatarURL() : member.user.avatarURL())
        .setDescription(`${member.user}`)
        .addFields([{ name: 'Status', value: member.presence ? member.presence.status : 'offline' }]);
      if (activitieslist.join('\n')) UsrEmbed.addFields([{ name: 'Activities', value: activitieslist.join('\n') }]);
      if (member.user.bannerURL()) UsrEmbed.setImage(member.user.bannerURL() ?? null);
      UsrEmbed.addFields([
        { name: 'Joined Server At', value: `<t:${Math.round(member.joinedTimestamp ?? 0 / 1000)}>\n<t:${Math.round(member.joinedTimestamp ?? 0 / 1000)}:R>` },
        { name: 'Created Account At', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>\n<t:${Math.round(member.user.createdTimestamp / 1000)}:R>` },
        { name: 'Roles', value: roleslist.join(', ') },
      ]);
      await interaction.reply({ embeds: [UsrEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};