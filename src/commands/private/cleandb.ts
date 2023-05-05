import { Command } from '~/types/Objects';

export const cleandb: Command = {
  description: 'cleans the db of guilds that no longer exist',
  async execute(message, args, client) {
    const settings = await sql.getData('settings', undefined, { all: true });
    for (const srvconfig of settings) {
      const guild = await client.guilds.fetch(srvconfig.guildId).catch(() => { return null; });
      if (guild) {
        const srvconfigs = await sql.getData('settings', { guildId: srvconfig.guildId }, { all: true });
        if (srvconfigs.length > 1) {
          await sql.delData('settings', { guildId: srvconfig.guildId });
          await sql.setData('settings', { guildId: srvconfig.guildId }, { ...srvconfigs[0] });
          message.reply(`duplicate settings removed from ${srvconfig.guildId}`);
        }
        continue;
      }
      await sql.delData('settings', { guildId: srvconfig.guildId });
      message.reply(`settings have been removed from ${srvconfig.guildId}`);
    }
    const reactionroles = await sql.getData('reactionroles', undefined, { all: true });
    for (const reactionrole of reactionroles) {
      const guild = await client.guilds.fetch(reactionrole.guildId).catch(() => { return null; });
      if (guild) continue;
      await sql.delData('reactionroles', { guildId: reactionrole.guildId });
      message.reply(`reactionroles have been removed from ${reactionrole.guildId}`);
    }
    const ticketdata = await sql.getData('ticketdata', undefined, { all: true });
    for (const ticket of ticketdata) {
      const guild = await client.guilds.fetch(ticket.guildId).catch(() => { return null; });
      if (guild) continue;
      await sql.delData('ticketdata', { guildId: ticket.guildId });
      message.reply(`ticketdata has been removed from ${ticket.guildId}`);
    }
    const memberdata = await sql.getData('memberdata', undefined, { all: true });
    for (const member of memberdata) {
      const guild = await client.guilds.fetch(member.guildId).catch(() => { return null; });
      if (guild) continue;
      await sql.delData('memberdata', { guildId: member.guildId });
      message.reply(`memberdata has been removed from ${member.guildId}`);
    }
    message.reply('Deleted all redundant data!');
  },
};