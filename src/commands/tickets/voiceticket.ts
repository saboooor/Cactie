import { getGuildConfig } from '~/functions/prisma';
import { GuildMember, TextChannel } from 'discord.js';
import createVoice from '~/functions/tickets/createVoice';
import { SlashCommand } from '~/types/Objects';

export const vcticket: SlashCommand = {
  description: 'Create a voiceticket',
  ephemeral: true,
  botPerms: ['ManageChannels'],
  async execute(message, args, client) {
    try {
      // Get server config
      const srvconfig = await getGuildConfig(message.guild!.id);

      // Create a ticket
      const msg = await createVoice(client, srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};