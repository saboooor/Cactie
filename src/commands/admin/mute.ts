import { EmbedBuilder, TextChannel } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const mute: SlashCommand<'cached'> = {
  description: 'Mute someone in the server',
  ephemeral: true,
  permission: 'ModerateMembers',
  botPerms: ['ManageRoles', 'ModerateMembers'],
  cooldown: 5,
  options: punish,
  async execute(interaction) {
    try {
      // Get mute role and check if role is valid
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const role = interaction.guild.roles.cache.get(srvconfig.mutecmd);
      if (!role && srvconfig.mutecmd != 'timeout') {
        error('This command is disabled!', interaction, true);
        return;
      }

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

      // Check if user is muted
      if (role && member.roles.cache.has(role.id)) {
        error('This user is already muted! Try unmuting instead.', interaction, true);
        return;
      }

      // Check if duration is set and if it's more than a year
      const timeArg = interaction.options.getString('time');
      const time = ms(timeArg ?? 'perm');
      if (role && time > 31536000000) {
        error('You cannot mute someone for more than 1 year!', interaction, true);
        return;
      }

      // Timeout feature can't mute someone for more than 30 days
      else if (time > 2592000000) {
        error('You cannot mute someone for more than 30 days with the timeout feature turned on!', interaction, true);
        return;
      }
      if (isNaN(time) && srvconfig.mutecmd == 'timeout') {
        error('You cannot mute someone forever with the timeout feature turned on!', interaction, true);
        return;
      }

      // Create embed and check if duration / reason are set and do stuff
      const MuteEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Muted ${member.user.username} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.`);

      // Add reason if specified
      const reason = interaction.options.getString('reason');
      if (reason) MuteEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Actually mute the dude (add role)
      if (role) await member.roles.add(role);
      else await member.timeout(time, `Muted by ${author.user.username} for ${reason}`);

      // Set member data for unmute time if set
      if (!isNaN(time)) {
        await prisma.memberdata.upsert({
          where: {
            memberId_guildId: {
              guildId: interaction.guild.id,
              memberId: member.id,
            },
          },
          update: {
            mutedUntil: `${Date.now() + time}`,
          },
          create: {
            memberId: member.id,
            guildId: interaction.guild.id,
            mutedUntil: `${Date.now() + time}`,
          },
        });
      }

      // Send mute message to target if silent is false
      if (!interaction.options.getBoolean('silent')) {
        await member.send({ content: `**You've been muted in ${interaction.guild.name} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
          });
      }
      logger.info(`Muted user: ${member.user.username} in ${interaction.guild.name} ${!isNaN(time) ? `for ${timeArg}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

      // Reply to command
      await interaction.reply({ embeds: [MuteEmbed] });

      // Check if log channel exists and send message
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        MuteEmbed.setTitle(`${author.user.username} ${MuteEmbed.toJSON().title}`);
        logchannel.send({ embeds: [MuteEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};