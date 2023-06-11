import { EmbedBuilder, GuildMemberRoleManager, TextChannel } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const mute: SlashCommand = {
  description: 'Mute someone in the server',
  ephemeral: true,
  permissions: ['ModerateMembers'],
  botPerms: ['ManageRoles', 'ModerateMembers'],
  cooldown: 5,
  options: punish,
  async execute(message, args) {
    try {
      // Get mute role and check if role is valid
      // Get server config
      const srvconfig = await getGuildConfig(message.guild!.id);
      const role = message.guild!.roles.cache.get(srvconfig.mutecmd);
      if (!role && srvconfig.mutecmd != 'timeout') {
        error('This command is disabled!', message, true);
        return;
      }

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

      // Check if user is muted
      if (role && member.roles.cache.has(role.id)) {
        error('This user is already muted! Try unmuting instead.', message, true);
        return;
      }

      // Check if duration is set and if it's more than a year
      const time = ms(args[1] ? args[1] : 'perm');
      if (role && time > 31536000000) {
        error('You cannot mute someone for more than 1 year!', message, true);
        return;
      }

      // Timeout feature can't mute someone for more than 30 days
      else if (time > 2592000000) {
        error('You cannot mute someone for more than 30 days with the timeout feature turned on!', message, true);
        return;
      }
      if (isNaN(time) && srvconfig.mutecmd == 'timeout') {
        error('You cannot mute someone forever with the timeout feature turned on!', message, true);
        return;
      }

      // Create embed and check if duration / reason are set and do stuff
      const MuteEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Muted ${member.user.username} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

      // Add reason if specified
      const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
      if (reason) MuteEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Actually mute the dude (add role)
      if (role) await member.roles.add(role);
      else await member.timeout(time, `Muted by ${author!.user.username} for ${args.slice(1).join(' ')}`);

      // Set member data for unmute time if set
      if (!isNaN(time)) {
        await prisma.memberdata.upsert({
          where: {
            memberId_guildId: {
              guildId: message.guild!.id,
              memberId: member.id,
            },
          },
          update: {
            mutedUntil: `${Date.now() + time}`,
          },
          create: {
            memberId: member.id,
            guildId: message.guild!.id,
            mutedUntil: `${Date.now() + time}`,
          },
        });
      }

      // Send mute message to target if silent is false
      if (!args[3]) {
        await member.send({ content: `**You've been muted in ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
          });
      }
      logger.info(`Muted user: ${member.user.username} in ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Reply to command
      await message.reply({ embeds: [MuteEmbed] });

      // Check if log channel exists and send message
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        MuteEmbed.setTitle(`${author!.user.username} ${MuteEmbed.toJSON().title}`);
        logchannel.send({ embeds: [MuteEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};