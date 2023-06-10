import { EmbedBuilder } from 'discord.js';
import ms from 'ms';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';
import prisma from '~/functions/prisma';

export const warns: SlashCommand = {
  description: 'View warns of a user in the server',
  permissions: ['ModerateMembers'],
  cooldown: 5,
  options: user,
  async execute(message, args) {
    try {
      // Get server config
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', message);
        return;
      }

      // Get user and check if user is valid
      let member = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }

      // Get current member data
      const memberdata = await prisma.memberdata.findUnique({
        where: {
          memberId_guildId: {
            guildId: message.guild!.id,
            memberId: member.id,
          },
        },
      });

      // Check if member has any warns
      if (!memberdata || !memberdata.warns) {
        error('This user has no warns!', message, true);
        return;
      }

      const warnList: {
        reason: string;
        created: number;
        until?: number;
      }[] = JSON.parse(memberdata.warns);

      // Create embed
      const WarnEmbed = new EmbedBuilder()
        .setTitle(`Warns for ${member.user.tag}`)
        .setColor('Random')
        .setDescription(`Total warns: ${warnList.length}`)
        .setFields(warnList.map((warn, i) => ({
          name: `Warn #${i + 1}`,
          value: `Reason: ${warn.reason}\n${warn.until ? `Expires in: ${ms(warn.until - Date.now(), { long: true })}` : 'Permanent'}`,
        })));

      // Reply to command
      await message.reply({ embeds: [WarnEmbed] });
    }
    catch (err) { error(err, message); }
  },
};