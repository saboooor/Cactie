import { EmbedBuilder, TextChannel } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import unwarnOptions from '~/options/unwarn';
import prisma, { getGuildConfig, getMemberData } from '~/functions/prisma';

function truncateString(str: string, num: number) {
  if (str.length <= num) return str; return str.slice(0, num - 1) + '…';
}

export const unwarn: SlashCommand<'cached'> = {
  description: 'Unwarn someone in this server',
  ephemeral: true,
  permission: 'ModerateMembers',
  cooldown: 5,
  options: unwarnOptions,
  async autoComplete(client, interaction) {
    const member = interaction.options.get('user')?.value;
    if (!member || typeof member !== 'string') {
      interaction.respond([{ name: 'Invalid Member!', value: '0' }]);
      return;
    }

    // Get Member Data
    const memberdata = await getMemberData(member, interaction.guild.id);

    // Check if member has any warns
    if (!memberdata || !memberdata.warns[0]) {
      interaction.respond([{ name: 'This user does not have any warnings.', value: '0' }]);
      return;
    }

    const warnList: {
      reason: string;
      created: number;
      until?: number;
    }[] = JSON.parse(memberdata.warns);

    const list = warnList.map((warn, i) => ({
      name: truncateString(`${i + 1}. ${warn.reason} - ${warn.until ? `Expires in: ${ms(warn.until - Date.now(), { long: true })}` : 'Permanent'}`, 100),
      value: `${warn.created}`,
    }));

    interaction.respond(list);
  },
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

      // Get Member Data
      const memberdata = await getMemberData(member.id, interaction.guild.id);

      // Check if member has any warns
      if (!memberdata || !memberdata.warns) {
        error('This user does not have any warnings.', interaction, true);
        return;
      }

      const warnList: {
        reason: string;
        created: number;
        until?: number;
      }[] = JSON.parse(memberdata.warns);

      const created = interaction.options.getString('warning', true);

      const warn = warnList.find(warning => warning.created === parseInt(created));
      if (!warn) {
        error('Invalid warning!', interaction, true);
        return;
      }

      // Create embed
      const WarnEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Unwarned ${member.user.username}.`)
        .setDescription(`**Warning:** ${warn.reason}\n**Created:** <t:${Math.round(warn.created / 1000)}>`);

      // Remove warn from warns array
      warnList.splice(warnList.indexOf(warn), 1);

      // Set member data for warn
      await prisma.memberdata.upsert({
        where: {
          memberId_guildId: {
            guildId: interaction.guild.id,
            memberId: member.id,
          },
        },
        update: {
          warns: JSON.stringify(warnList),
        },
        create: {
          memberId: member.id,
          guildId: interaction.guild.id,
          warns: JSON.stringify(warnList),
        },
      });

      // Send warn message to target if silent is false
      if (!interaction.options.getBoolean('silent')) {
        await member.send({ content: `## Your warning has been removed in ${interaction.guild.name}\n**Warning:** ${warn.reason}\n**Created:** <t:${Math.round(warn.created / 1000)}>` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that the warning was removed.' });
          });
      }
      logger.info(`Unwarned user: ${member.user.username} in ${interaction.guild.name}. Reason: ${warn.reason}\n${warn.until ? `Expires in: ${ms(warn.until - Date.now(), { long: true })}` : 'Permanent'}`);

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