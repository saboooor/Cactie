import { EmbedBuilder, GuildMemberRoleManager, TextChannel, User } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma from '~/functions/prisma';

export const ban: SlashCommand = {
  description: 'Ban someone from the server',
  ephemeral: true,
  args: true,
  usage: '<User @ or Id> [Time] [Reason]',
  permissions: ['BanMembers'],
  botPerms: ['BanMembers'],
  cooldown: 5,
  options: punish,
  async execute(message, args) {
    try {
      // Get user and check if user is valid
      let member = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }

      // Get member and author and check if role is lower than member's role
      const author = message.member;
      const authorRoles = author!.roles as GuildMemberRoleManager;
      const botRoles = message.guild!.members.me!.roles as GuildMemberRoleManager;
      if (member.roles.highest.rawPosition > authorRoles.highest.rawPosition) {
        error(`You can't do that! Your role is ${member.roles.highest.rawPosition - authorRoles.highest.rawPosition} positions lower than the user's role!`, message, true);
        return;
      }
      if (member.roles.highest.rawPosition > botRoles.highest.rawPosition) {
        error(`I can't do that! My role is ${member.roles.highest.rawPosition - botRoles.highest.rawPosition} positions lower than the user's role!`, message, true);
        return;
      }

      // Get amount of time to ban, if not specified, then permanent
      const time = ms(args[1] ? args[1] : 'perm');
      if (time > 31536000000) {
        error('You cannot ban someone for more than 1 year!', message, true);
        return;
      }

      // Create embed and check if bqn has a reason / time period
      const BanEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Banned ${member.user.tag} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

      // Add reason if specified
      const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
      if (reason) BanEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Send ban message to target
      await member.send({ content: `**You've been banned from ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
        .catch(err => {
          logger.warn(err);
          message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
        });
      logger.info(`Banned user: ${member.user.tag} from ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Set unban timestamp to member data for auto-unban
      if (!isNaN(time)) prisma.memberdata.update({ where: { memberId_guildId: { guildId: message.guild!.id, memberId: member.id } }, data: { bannedUntil: `${Date.now() + time}` } });

      // Actually ban the dude
      await member.ban({ reason: `${(author!.user as User).tag} banned user: ${member.user.tag} from ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

      // Reply with response
      await message.reply({ embeds: [BanEmbed] });

      // Check if log channel exists and send message
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', message);
        return;
      }
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        BanEmbed.setTitle(`${(author!.user as User).tag} ${BanEmbed.toJSON().title}`);
        logchannel.send({ embeds: [BanEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};