import { EmbedBuilder } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';
import prisma from '~/functions/prisma';

export const warns: SlashCommand<'cached'> = {
  description: 'View warns of a user in the server',
  permission: 'ModerateMembers',
  cooldown: 5,
  options: user,
  async execute(interaction) {
    try {
      const member = interaction.options.getMember('user');
      if (!member) {
        error('Invalid Member! Did they leave the server?', interaction, true);
        return;
      }

      // Get current member data
      const memberdata = await prisma.memberdata.findUnique({
        where: {
          memberId_guildId: {
            guildId: interaction.guild.id,
            memberId: member.id,
          },
        },
        cacheStrategy: { ttl: 60 },
      });

      // Check if member has any warns
      if (!memberdata || !memberdata.warns) {
        error('This user has no warns!', interaction, true);
        return;
      }

      const warnList: {
        reason: string;
        created: number;
        until?: number;
      }[] = JSON.parse(memberdata.warns);

      // Create embed
      const WarnEmbed = new EmbedBuilder()
        .setTitle(`Warns for ${member.user.username}`)
        .setColor('Random')
        .setDescription(`Total warns: ${warnList.length}`)
        .setFields(warnList.map((warn, i) => ({
          name: `Warn #${i + 1}`,
          value: `Reason: ${warn.reason}\n${warn.until ? `Expires in: ${ms(warn.until - Date.now(), { long: true })}` : 'Permanent'}`,
        })));

      // Reply to command
      await interaction.reply({ embeds: [WarnEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};