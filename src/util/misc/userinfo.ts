import { ButtonInteraction, ContainerBuilder, ContextMenuCommandInteraction, GuildMember, MessageFlags, SectionBuilder, CommandInteraction, User } from 'discord.js';
import convertTime from '~/util/music/convert';
import progressbar from '~/util/music/progressbar';
import { UserRound } from '~/dict/emoji';

export async function getUserInfo(user: User, interaction: ButtonInteraction | CommandInteraction | ContextMenuCommandInteraction, member?: GuildMember | null) {
  user = await user.fetch();

  const roles = member ? Array.from(member.roles.cache).sort(function(a, b) {
    if (b[1].rawPosition < a[1].rawPosition) return -1;
    if (b[1].rawPosition > a[1].rawPosition) return 1;
    return 0;
  }) : null;
  const roleslist = roles?.map(role => { return `${role[1]}`; });

  const activities = member?.presence ? member.presence.activities : null;
  const activitieslist = activities?.map(activity => {
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
      activitystack.push(`\n-# Started <t:${Math.round(Number(activity.timestamps.start) / 1000)}:R>`);
    }
    else if (activity.timestamps && activity.timestamps.end) {
      activitystack.push(`\n-# Ends <t:${Math.round(Number(activity.timestamps.end) / 1000)}:R>`);
    }
    else if (activity.createdTimestamp) {
      activitystack.push(`\n-# Created <t:${Math.round(activity.createdTimestamp / 1000)}:R>`);
    }

    const imageUrl = activity.assets?.largeImageURL()
          ?? activity.assets?.smallImageURL();

    if (imageUrl) return new SectionBuilder()
      .addTextDisplayComponents(textDisplay => textDisplay
        .setContent(activitystack.join('')),
      )
      .setThumbnailAccessory(thumbnail => thumbnail
        .setURL(imageUrl),
      );
    else return activitystack.join('');
  });

  const name = `${member?.displayName && member.displayName != user.username ? `${member.displayName} (${member.user.username})` : user.username}`;

  const UserInfoContainer = new ContainerBuilder();

  const bannerUrl = user.bannerURL({ size: 4096 });
  if (bannerUrl) UserInfoContainer
    .addMediaGalleryComponents(gallery => gallery
      .addItems(item => item
        .setURL(bannerUrl)
        .setDescription(`${name}'s Banner`),
      ),
    );

  UserInfoContainer
    .addSectionComponents(section => section
      .addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`# ${UserRound.getString()} ${name}\n${
          user
        }\n-# ${member?.presence ? member.presence.status : 'offline'}\n${
          `**Created Account**\n<t:${Math.round(user.createdTimestamp / 1000)}>\n<t:${Math.round(user.createdTimestamp / 1000)}:R>`
        }`),
      )
      .setThumbnailAccessory(thumbnail => thumbnail
        .setURL(
          member?.avatarURL({ size: 4096 }) ?? user.avatarURL({ size: 4096 }) ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
        ),
      ),
    );

  if (user.accentColor) UserInfoContainer.setAccentColor(user.accentColor);

  if (activitieslist?.length) {
    UserInfoContainer
      .addSeparatorComponents(separator => separator)
      .addTextDisplayComponents(textDisplay => textDisplay
        .setContent('## Activities'),
      );
    activitieslist.forEach(activity => {
      if (activity instanceof SectionBuilder) return UserInfoContainer.addSectionComponents(activity);
      else return UserInfoContainer.addTextDisplayComponents(textDisplay => textDisplay.setContent(activity));
    });
  }
  if (member) {
    UserInfoContainer
      .addSeparatorComponents(separator => separator)
      .addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`**Roles**\n${
              roleslist!.join(', ')
        }\n**Joined Server**\n<t:${
          Math.round((member.joinedTimestamp ?? 0) / 1000)
        }>\n<t:${
          Math.round((member.joinedTimestamp ?? 0) / 1000)
        }:R>`),
      );
  }
  await interaction.reply({ components: [UserInfoContainer], flags: [MessageFlags.IsComponentsV2], allowedMentions: { parse: [] } });
};