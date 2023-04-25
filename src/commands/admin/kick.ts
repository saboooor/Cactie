import { EmbedBuilder, GuildMemberRoleManager, TextChannel, User } from 'discord.js';
import { SlashCommand } from 'types/Objects';
import kickOptions from '../../options/kick';

export const kick: SlashCommand = {
  description: 'Kick someone from the server',
  ephemeral: true,
  args: true,
  usage: '<User @ or Id> [Reason]',
  permissions: ['KickMembers'],
  botPerms: ['KickMembers'],
  cooldown: 5,
  options: kickOptions,
  async execute(message, args) {
    try {
      // Get user and check if user is valid
      let member = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) return error('Invalid member! Are they in this server?', message, true);

      // Get member and author and check if role is lower than member's role
      const author = message.member;
      const authorRoles = author!.roles as GuildMemberRoleManager;
      const botRoles = message.guild!.members.me!.roles as GuildMemberRoleManager;
      if (member.roles.highest.rawPosition > authorRoles.highest.rawPosition) return error(`You can't do that! Your role is ${member.roles.highest.rawPosition - authorRoles.highest.rawPosition} positions lower than the user's role!`, message, true);
      if (member.roles.highest.rawPosition > botRoles.highest.rawPosition) return error(`I can't do that! My role is ${member.roles.highest.rawPosition - botRoles.highest.rawPosition} positions lower than the user's role!`, message, true);

      // Create embed
      const KickEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Kicked ${member.user.tag}.`);

      // Add reason if specified
      if (args[1]) KickEmbed.addFields([{ name: 'Reason', value: args.slice(1).join(' ') }]);

      // Send kick message to target
      await member.send({ content: `**You've been kicked from ${message.guild!.name}.${args[1] ? ` Reason: ${args.slice(1).join(' ')}` : ''}**` })
        .catch(err => {
          logger.warn(err);
          message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
        });

      // Reply with response
      await message.reply({ embeds: [KickEmbed] });

      // Actually kick the dude
      await member.kick(`${(message.member!.user as User).tag} kicked: ${member.user.tag} from ${message.guild!.name} for ${args.slice(1).join(' ')}`);
      logger.info(`Kicked user: ${member.user.tag} from ${message.guild!.name}`);

      // Check if log channel exists and send message
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        KickEmbed.setTitle(`${(message.member!.user as User).tag} ${KickEmbed.toJSON().title}`);
        logchannel.send({ embeds: [KickEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};