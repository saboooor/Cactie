import { PrismaClient } from '@prisma/client';
import { GuildMember, TextChannel } from 'discord.js';
import createVoice from '~/functions/tickets/createVoice';
import { SlashCommand } from '~/types/Objects';

export const vcticket: SlashCommand = {
  description: 'Create a voiceticket',
  ephemeral: true,
  aliases: ['voiceticket', 'voicenew', 'voice'],
  botPerms: ['ManageChannels'],
  async execute(message, args, client) {
    try {
      // Get server config
      const prisma = new PrismaClient();
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', message);
        return;
      }

      // Create a ticket
      const msg = await createVoice(client, srvconfig, message.member as GuildMember, message.channel as TextChannel);

      // Send the message
      await message.reply(msg);
    }
    catch (err) { error(err, message, true); }
  },
};