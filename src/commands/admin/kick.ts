import { EmbedBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish-notime';
import { getGuildConfig } from '~/functions/prisma';

export const kick: SlashCommand<'cached'> = {
  description: 'Kick someone from this server',
  ephemeral: true,
  permission: 'KickMembers',
  botPerms: ['KickMembers'],
  cooldown: 5,
  options: punish,
  async execute(interaction) {
    try {
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

      // Create embed
      const KickEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Kicked ${member.user.username}.`);

      // Add reason if specified
      const reason = interaction.options.getString('reason');
      if (reason) KickEmbed.addFields([{ name: 'Reason', value: reason }]);

      // Send kick message to target if silent is false
      if (!interaction.options.getBoolean('silent')) {
        await member.send({ content: `## You've been kicked from ${interaction.guild.name}.${reason ? `\n**Reason:** ${reason}` : ''}` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
          });
      }

      // Reply with response
      await interaction.reply({ embeds: [KickEmbed] });

      // Actually kick the dude
      await member.kick(`${author.user.username} kicked: ${member.user.username} from ${interaction.guild.name} for ${reason}`);
      logger.info(`Kicked user: ${member.user.username} from ${interaction.guild.name}`);

      // Check if log channel exists and send message
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        KickEmbed.setTitle(`${author.user.username} ${KickEmbed.toJSON().title}`);
        logchannel.send({ embeds: [KickEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};