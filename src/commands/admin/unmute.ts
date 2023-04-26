import { EmbedBuilder, TextChannel, User } from 'discord.js';
import { SlashCommand } from 'types/Objects';
import user from '../../options/user';

export const unmute: SlashCommand = {
  description: 'Unmute someone that was muted in the server',
  ephemeral: true,
  args: true,
  usage: '<User @ or Id>',
  permissions: ['ModerateMembers'],
  botPerms: ['ManageRoles', 'ModerateMembers'],
  cooldown: 5,
  options: user,
  async execute(message, args) {
    try {
      // Get settings and check if mutecmd is enabled
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });
      const role = await message.guild!.roles.cache.get(srvconfig.mutecmd);
      if (!role && srvconfig.mutecmd != 'timeout') {
        error('This command is disabled!', message, true);
        return;
      }

      // Get user and check if user is valid
      let member = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!member) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }

      // Check if user is unmuted
      if (role && !member.roles.cache.has(role.id)) {
        error('This user is not muted!', message, true);
        return;
      }

      // Actually get rid of the mute role or untimeout
      if (role) await member.roles.remove(role);
      else await member.timeout(null);

      // Reset the mute timer
      const data = await sql.getData('memberdata', { memberId: member.id, guildId: message.guild!.id }, { nocreate: true });
      if (data) await sql.setData('memberdata', { memberId: member.id, guildId: message.guild!.id }, { mutedUntil: null });

      // Send unmute message to user
      await member.send({ content: '**You\'ve been unmuted**' })
        .catch(err => {
          logger.warn(err);
          message.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
        });

      // Create embed with color and title
      const UnmuteEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Unmuted ${member.user.tag}`);

      // Reply with unban log
      message.reply({ embeds: [UnmuteEmbed] });
      logger.info(`Unmuted ${member.user.tag} in ${message.guild!.name}`);

      // Check if log channel exists and send message
      const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel;
      if (logchannel) {
        UnmuteEmbed.setTitle(`${(message.member!.user as User).tag} ${UnmuteEmbed.toJSON().title}`);
        logchannel.send({ embeds: [UnmuteEmbed] });
      }
    }
    catch (err) { error(err, message); }
  },
};