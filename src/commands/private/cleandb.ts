import prisma from '~/functions/prisma';
import { Command } from '~/types/Objects';

export const cleandb: Command = {
  description: 'cleans the db of guilds that no longer exist',
  async execute(message, args, client) {
    const settings = await prisma.settings.findMany({
      cacheStrategy: { ttl: 60 },
    });
    for (const srvconfig of settings) {
      const guild = await client.guilds.fetch(srvconfig.guildId).catch(() => { return null; });
      if (guild) {
        const srvconfigs = await prisma.settings.findMany({
          where: {
            guildId: srvconfig.guildId,
          },
          cacheStrategy: { ttl: 60 },
        });
        if (srvconfigs.length > 1) {
          await prisma.settings.deleteMany({ where: { guildId: srvconfig.guildId } });
          await prisma.settings.create({ data: { ...srvconfigs[0] } });
          message.reply(`duplicate settings removed from ${srvconfig.guildId}`);
        }
        continue;
      }
      await prisma.settings.deleteMany({ where: { guildId: srvconfig.guildId } });
      message.reply(`settings have been removed from ${srvconfig.guildId}`);
    }
    const reactionroles = await prisma.reactionroles.findMany({
      cacheStrategy: { ttl: 60 },
    });
    for (const reactionrole of reactionroles) {
      const guild = await client.guilds.fetch(reactionrole.guildId).catch(() => { return null; });
      if (guild) continue;
      await prisma.reactionroles.delete({ where: { messageId_emojiId: reactionrole } });
      message.reply(`reactionroles have been removed from ${reactionrole.guildId}`);
    }
    const ticketdata = await prisma.ticketdata.findMany({
      cacheStrategy: { ttl: 60 },
    });
    for (const ticket of ticketdata) {
      const guild = await client.guilds.fetch(ticket.guildId).catch(() => { return null; });
      if (guild) continue;
      await prisma.ticketdata.delete({ where: { channelId: ticket.channelId } });
      message.reply(`ticketdata has been removed from ${ticket.guildId}`);
    }
    const memberdata = await prisma.memberdata.findMany({
      cacheStrategy: { ttl: 60 },
    });
    for (const member of memberdata) {
      const guild = await client.guilds.fetch(member.guildId).catch(() => { return null; });
      if (guild) continue;
      await prisma.memberdata.delete({ where: { memberId_guildId: { memberId: member.memberId, guildId: member.guildId } } });
      message.reply(`memberdata has been removed from ${member.guildId}`);
    }
    message.reply('Deleted all redundant data!');
  },
};