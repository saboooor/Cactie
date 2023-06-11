import { EmbedBuilder, GuildMemberRoleManager, TextChannel, User } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import punish from '~/options/punish-notime';
import prisma from '~/functions/prisma';

export const kick: SlashCommand = {
  description: 'Kick someone from the server',
  ephemeral: true,
  permissions: ['KickMembers'],
  botPerms: ['KickMembers'],
  cooldown: 5,
  options: punish,
  async execute(message, args) {
    try {
      // Get user and check if user is valid
      let member = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }

      // Get member and author and check if role is lower than member's role
      const author = message.member;
      const authorRoles = author!.roles as GuildMemberRoleManager;
      const botRoles = message.guild!.members.me!.roles as GuildMemberRoleManager;
      if (member.roles.highest.rawPosition > authorRoles.highest.rawPosition) {
        error(`You can't do that! Your role is ${member.roles.highest.rawPosition - authorRoles.highest.rawPosition} positions lower than the user's role!`, message, true);
        return;
      }
      if (member.roles.highest.rawPosition > botRoles.highest.rawPosition) {
        error(`I can't do that! My role is ${member.roles.highest.rawPosition - botRoles.highest.rawPosition} positions lower than the user's role!`, message, true);
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
        await member.send({ content: `**You've been kicked from ${message.guild!.name}.${args[1] ? ` Reason: ${args.slice(1).join(' ')}` : ''}**` })
          .catch(err => {
            logger.warn(err);
            message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
          });
      }

      // Reply with response
      await message.reply({ embeds: [KickEmbed] });

      // Actually kick the dude
      await member.kick(`${message.member!.user.username} kicked: ${member.user.username} from ${message.guild!.name} for ${args.slice(1).join(' ')}`);
      logger.info(`Kicked user: ${member.user.username} from ${message.guild!.name}`);

      // Check if log channel exists and send message
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('This server\'s settings could not be found! It must have been corrupted. Fix this by going into the dashboard at https://cactie.luminescent.dev and selecting your server and it will automatically re-create for you.', message);
        return;
      }
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        KickEmbed.setTitle(`${message.member!.user.username} ${KickEmbed.toJSON().title}`);
        logchannel.send({ embeds: [KickEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};