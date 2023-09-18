import { EmbedBuilder, TextChannel } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const warn: SlashCommand<'cached'> = {
  description: 'Warn someone in the server',
  ephemeral: true,
  permission: 'ModerateMembers',
  cooldown: 5,
  options: punish,
  async execute(interaction) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);

      // Get user and check if user is valid
      const member = interaction.options.getMember('user');
      if (!member) {
        error('Invalid Member! Did they leave the server?', interaction, true);
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

      // Check if duration is set and if it's more than a year
      const timeArg = interaction.options.getString('time');
      const time = ms(timeArg ?? 'perm');
      if (time > 31536000000) {
        error('You cannot warn someone for more than 1 year!', interaction, true);
        return;
      }

      // Create embed and check if duration / reason are set and do stuff
      const WarnEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Warned ${member.user.username} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.`);

      // Add reason if specified
      const reason = interaction.options.getString('reason');
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
            guildId: interaction.guild.id,
            memberId: member.id,
          },
        },
      });
      if (memberdata && memberdata.warns) warns.push(...JSON.parse(memberdata.warns));

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
            guildId: interaction.guild.id,
            memberId: member.id,
          },
        },
        update: {
          warns: JSON.stringify(warns),
        },
        create: {
          memberId: member.id,
          guildId: interaction.guild.id,
          warns: JSON.stringify(warns),
        },
      });

      // Send warn message to target if silent is false
      if (!interaction.options.getBoolean('silent')) {
        await member.send({ content: `**You've been warned in ${interaction.guild.name} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
          });
      }
      logger.info(`Warned user: ${member.user.username} in ${interaction.guild.name} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Reply to command
      await interaction.reply({ embeds: [WarnEmbed] });

      // Check if log channel exists and send message
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        WarnEmbed.setTitle(`${author.user.username} ${WarnEmbed.toJSON().title}`);
        logchannel.send({ embeds: [WarnEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};