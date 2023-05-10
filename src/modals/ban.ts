import { PrismaClient } from '@prisma/client';
import { EmbedBuilder, GuildMemberRoleManager, User, TextChannel } from 'discord.js';
import ms from 'ms';
import { Modal } from '~/types/Objects';

export const ban: Modal = {
  deferReply: true,
  ephemeral: true,
  execute: async (interaction, client, memberId) => {
    try {
      // Check if guild
      if (!interaction.guild) return;

      // Get user and check if user is valid
      let member = interaction.guild.members.cache.get(memberId);
      if (!member) member = await interaction.guild.members.fetch(memberId);
      if (!member) {
        error('Invalid member! Are they in this server?', interaction, true);
        return;
      }

      // Get member and author and check if role is lower than member's role
      const author = interaction.member;
      if (!author || !(author.roles instanceof GuildMemberRoleManager)) return;
      const authorTag = author.user instanceof User ? author.user.tag : `${author.user.username}#${author.user.discriminator}`;

      const authorRoles = author!.roles as GuildMemberRoleManager;
      const botRoles = interaction.guild!.members.me!.roles as GuildMemberRoleManager;
      if (member.roles.highest.rawPosition > authorRoles.highest.rawPosition) {
        error(`You can't do that! Your role is ${member.roles.highest.rawPosition - authorRoles.highest.rawPosition} positions lower than the user's role!`, interaction, true);
        return;
      }
      if (member.roles.highest.rawPosition > botRoles.highest.rawPosition) {
        error(`I can't do that! My role is ${member.roles.highest.rawPosition - botRoles.highest.rawPosition} positions lower than the user's role!`, interaction, true);
        return;
      }

      // Get amount of time to ban, if not specified, then permanent
      const timeField = interaction.fields.getTextInputValue('time');
      const time = ms(timeField ? timeField : 'perm');
      if (time > 31536000000) {
        error('You cannot ban someone for more than 1 year!', interaction, true);
        return;
      }

      // Create embed and check if bqn has a reason / time period
      const BanEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Banned ${member.user.tag} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.`);

      // Add reason if specified
      const reason = interaction.fields.getTextInputValue('reason');
      if (reason) { BanEmbed.addFields([{ name: 'Reason', value: reason }]); }

      // Send ban message to target
      await member.send({ content: `**You've been banned from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
        .catch(err => {
          logger.warn(err);
          interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
        });
      logger.info(`Banned user: ${member.user.tag} from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Set unban timestamp to member data for auto-unban
      const prisma = new PrismaClient();
      if (!isNaN(time)) {
        await prisma.memberdata.upsert({
          where: { memberId_guildId: { memberId: member.id, guildId: interaction.guild.id } },
          create: { memberId: member.id, guildId: interaction.guild.id, bannedUntil: `${Date.now() + time}` },
          update: { bannedUntil: `${Date.now() + time}` },
        });
      }

      // Actually ban the dude
      await member.ban({ reason: `${authorTag} banned user: ${member.user.tag} from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

      // Reply with response
      await interaction.reply({ embeds: [BanEmbed] });

      // Check if log channel exists and send message
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: interaction.guild.id } });
      if (!srvconfig) return;
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        BanEmbed.setTitle(`${authorTag} ${BanEmbed.toJSON().title}`);
        logchannel.send({ embeds: [BanEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};