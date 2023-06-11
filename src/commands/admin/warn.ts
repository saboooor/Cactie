import { EmbedBuilder, GuildMemberRoleManager, TextChannel, User } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma from '~/functions/prisma';

export const warn: SlashCommand = {
  description: 'Warn someone in the server',
  ephemeral: true,
  permissions: ['ModerateMembers'],
  cooldown: 5,
  options: punish,
  async execute(message, args) {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', message);
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

      // Check if duration is set and if it's more than a year
      const time = ms(args[1] ? args[1] : 'perm');
      if (time > 31536000000) {
        error('You cannot warn someone for more than 1 year!', message, true);
        return;
      }

      // Create embed and check if duration / reason are set and do stuff
      const WarnEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Warned ${member.user.username} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

      // Add reason if specified
      const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
      if (reason) WarnEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Make warns array
      const warns: {
        reason: string;
        created: number;
        until?: number;
      }[] = [];

      // Get current member data
      const memberdata = await prisma.memberdata.findUnique({
        where: {
          memberId_guildId: {
            guildId: message.guild!.id,
            memberId: member.id,
          },
        },
      });
      if (memberdata && memberdata.warns) {
        const currentWarns = JSON.parse(memberdata.warns);
        warns.push(...currentWarns);
      }

      // Add warn to warns array
      warns.push({
        reason: reason ? reason : 'No reason specified.',
        created: Date.now(),
        until: !isNaN(time) ? Date.now() + time : undefined,
      });

      // Set member data for warn
      await prisma.memberdata.upsert({
        where: {
          memberId_guildId: {
            guildId: message.guild!.id,
            memberId: member.id,
          },
        },
        update: {
          warns: JSON.stringify(warns),
        },
        create: {
          memberId: member.id,
          guildId: message.guild!.id,
          warns: JSON.stringify(warns),
        },
      });

      // Send warn message to target if silent is false
      if (!args[3]) {
        await member.send({ content: `**You've been warned in ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
          });
      }
      logger.info(`Warned user: ${member.user.username} in ${message.guild!.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Reply to command
      await message.reply({ embeds: [WarnEmbed] });

      // Check if log channel exists and send message
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        WarnEmbed.setTitle(`${author!.user.username} ${WarnEmbed.toJSON().title}`);
        logchannel.send({ embeds: [WarnEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};