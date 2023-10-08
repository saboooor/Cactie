import { EmbedBuilder } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';
import { getPunishments } from '~/functions/prisma';

export const warns: SlashCommand<'cached'> = {
  description: 'View someone\'s warnings',
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
      const punishments = await getPunishments(member.id, interaction.guild.id);

      // Check if member has any warnings
      if (!punishments || !punishments.warns[0]) {
        error('This member does not have any warnings.', interaction, true);
        return;
      }

      const warnList: {
        reason: string;
        created: number;
        until?: number;
      }[] = JSON.parse(punishments.warns);

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