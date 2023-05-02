import { GuildMember, TextChannel } from 'discord.js';
import manageUsers from '~/functions/tickets/manageUsers';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';

export const add: SlashCommand = {
  description: 'Add someone to a ticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  args: true,
  usage: '<User>',
  options: user,
  async execute(message, args) {
    try {
      // Check if user is valid
      const targetMember = message.guild!.members.cache.get(args[0].replace(/\D/g, ''));
      if (!targetMember) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }

      // Add user to ticket
      const msg = await manageUsers(message.member as GuildMember, message.channel as TextChannel, targetMember, true);

      // Send message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};