import { EmbedBuilder, TextChannel } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const ban: SlashCommand<'cached'> = {
  description: 'Ban someone from the server',
  ephemeral: true,
  permissions: ['BanMembers'],
  botPerms: ['BanMembers'],
  cooldown: 5,
  options: punish,
  async execute(interaction, args) {
    try {
      // Get user and check if user is valid
      let member = interaction.guild.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await interaction.guild.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', interaction, true);
        return;
      }

      // Get member and author and check if role is lower than member's role
      const author = interaction.member;
      const authorRoles = author.roles;
      const botRoles = interaction.guild.members.me!.roles;
      if (member.roles.highest.rawPosition > authorRoles.highest.rawPosition) {
        error(`You can't do that! Your role is ${member.roles.highest.rawPosition - authorRoles.highest.rawPosition} positions lower than the user's role!`, interaction, true);
        return;
      }
      if (member.roles.highest.rawPosition > botRoles.highest.rawPosition) {
        error(`I can't do that! My role is ${member.roles.highest.rawPosition - botRoles.highest.rawPosition} positions lower than the user's role!`, interaction, true);
        return;
      }

      // Get amount of time to ban, if not specified, then permanent
      const time = ms(args[1] ? args[1] : 'perm');
      if (time > 31536000000) {
        error('You cannot ban someone for more than 1 year!', interaction, true);
        return;
      }

      // Create embed and check if bqn has a reason / time period
      const BanEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Banned ${member.user.username} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.`);

      // Add reason if specified
      const reason = args.slice(!isNaN(time) ? 2 : 1).join(' ');
      if (reason) BanEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Send ban interaction to target if silent is false
      if (!args[3]) {
        await member.send({ content: `**You've been banned from ${interaction.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
          });
      }
      logger.info(`Banned user: ${member.user.username} from ${interaction.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Set unban timestamp to member data for auto-unban
      if (!isNaN(time)) {
        await prisma.memberdata.upsert({
          where: {
            memberId_guildId: {
              guildId: interaction.guild.id,
              memberId: member.id,
            },
          },
          update: {
            bannedUntil: `${Date.now() + time}`,
          },
          create: {
            memberId: member.id,
            guildId: interaction.guild.id,
            bannedUntil: `${Date.now() + time}`,
          },
        });
      }

      // Actually ban the dude
      await member.ban({ reason: `${author.user.username} banned user: ${member.user.username} from ${interaction.guild.name} ${!isNaN(time) ? `for ${args[1]}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

      // Reply with response
      await interaction.reply({ embeds: [BanEmbed] });

      // Check if log channel exists and send interaction
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        BanEmbed.setTitle(`${author.user.username} ${BanEmbed.toJSON().title}`);
        logchannel.send({ embeds: [BanEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};