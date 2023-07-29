import { EmbedBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const unmute: SlashCommand<'cached'> = {
  description: 'Unmute someone that was muted in the server',
  ephemeral: true,
  permission: 'ModerateMembers',
  botPerms: ['ManageRoles', 'ModerateMembers'],
  cooldown: 5,
  options: user,
  async execute(interaction) {
    try {
      // Get server config and check if mutecmd is enabled
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const role = await interaction.guild.roles.cache.get(srvconfig.mutecmd);
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

      // Check if user is unmuted
      if (role && !member.roles.cache.has(role.id)) {
        error('This user is not muted!', interaction, true);
        return;
      }

      // Actually get rid of the mute role or untimeout
      if (role) await member.roles.remove(role);
      else await member.timeout(null);

      // Reset the mute timer
      // Get server config
      const data = await prisma.memberdata.findUnique({ where: { memberId_guildId: { memberId: member.id, guildId: interaction.guild.id } } });
      if (data) await prisma.memberdata.update({ where: { memberId_guildId: { memberId: member.id, guildId: interaction.guild.id } }, data: { mutedUntil: null } });

      // Send unmute message to user
      await member.send({ content: '**You\'ve been unmuted**' })
        .catch(err => {
          logger.warn(err);
          interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
        });

      // Create embed with color and title
      const UnmuteEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Unmuted ${member.user.username}`);

      // Reply with unban log
      interaction.reply({ embeds: [UnmuteEmbed] });
      logger.info(`Unmuted ${member.user.username} in ${interaction.guild.name}`);

      // Check if log channel exists and send message
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        UnmuteEmbed.setTitle(`${interaction.user.username} ${UnmuteEmbed.toJSON().title}`);
        logchannel.send({ embeds: [UnmuteEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};