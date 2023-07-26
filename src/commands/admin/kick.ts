import { EmbedBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish-notime';
import { getGuildConfig } from '~/functions/prisma';

export const kick: SlashCommand<'cached'> = {
  description: 'Kick someone from the server',
  ephemeral: true,
  permissions: ['KickMembers'],
  botPerms: ['KickMembers'],
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

      // Create embed
      const KickEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Kicked ${member.user.username}.`);

      // Add reason if specified
      if (args[1]) KickEmbed.addFields([{ name: 'Reason', value: args.slice(1).join(' ') }]);

      // Send kick message to target if silent is false
      if (!args[2]) {
        await member.send({ content: `**You've been kicked from ${interaction.guild.name}.${args[1] ? ` Reason: ${args.slice(1).join(' ')}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
          });
      }

      // Reply with response
      await interaction.reply({ embeds: [KickEmbed] });

      // Actually kick the dude
      await member.kick(`${author.user.username} kicked: ${member.user.username} from ${interaction.guild.name} for ${args.slice(1).join(' ')}`);
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