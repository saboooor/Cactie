import { schedule } from 'node-cron';
import { EmbedBuilder, Client, TextChannel } from 'discord.js';
import prisma, { getGuildConfig } from '~/functions/prisma';

export default async (client: Client) => schedule('* * * * *', async () => {
  await prisma.punishments.deleteMany({
    where: {
      mutedUntil: null,
      bannedUntil: null,
      warns: '[]',
    },
  });

  // Get all member data
  const punishments = await prisma.punishments.findMany({
  });

  // Iterate through every row in the data
  for (const data of punishments) {
    // Get the guild from the guildId
    const guild = await client.guilds.fetch(data.guildId).catch(() => { return null; });
    if (!guild) continue;

    // Get the guild config
    const srvconfig = await getGuildConfig(data.guildId);

    // Get the member from the memberId, and user just in case member is invalid
    const member = await guild.members.fetch(data.memberId).catch(() => { return null; });
    const user = await client.users.fetch(data.memberId).catch(() => { return null; });

    if (data.mutedUntil && Number(data.mutedUntil) < Date.now()) {
      // Get the role and if it exists get rid of it from the member
      const role = await guild.roles.cache.get(srvconfig.mutecmd);
      if (role && member) await member.roles.remove(role);

      // Send the unmute message to the member if it was fetched properly
      if (user) user.send({ content: `**You have been unmuted in ${guild.name}**` }).catch(err => logger.warn(err));
      logger.info(`Unmuted ${user ? user.username : data.memberId} in ${guild.name}`);

      // Set the data
      await prisma.punishments.update({ where: { memberId_guildId: { memberId: data.memberId, guildId: guild.id } }, data: { mutedUntil: null } });

      // Check if log channel exists and send message
      const logchannel = guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        const UnmuteEmbed = new EmbedBuilder().setTitle(`${user ? user.username : data.memberId} has been unmuted`);
        logchannel.send({ embeds: [UnmuteEmbed] });
      }
    }
    if (data.bannedUntil && Number(data.bannedUntil) < Date.now()) {
      // Attempt to unban the member
      await guild.members.unban(data.memberId).catch(err => logger.error(err));

      // Send the unban message to the member if it was fetched properly
      if (user) user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(err => logger.warn(err));
      logger.info(`Unbanned ${user ? user.username : data.memberId} in ${guild.name}`);

      // Set the data
      await prisma.punishments.update({ where: { memberId_guildId: { memberId: data.memberId, guildId: guild.id } }, data: { bannedUntil: null } });

      // Check if log channel exists and send message
      const logchannel = guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        const UnbanEmbed = new EmbedBuilder().setTitle(`${user ? user.username : data.memberId} has been unbanned`);
        logchannel.send({ embeds: [UnbanEmbed] });
      }
    }
    if (data.warns != '[]') {
      const warnList: {
        reason: string;
        created: number;
        until?: number;
      }[] = JSON.parse(data.warns);

      // Iterate through every warn
      for (const warn of warnList) {
        if (warn.until && warn.until < Date.now()) {
          // Remove warn from warns array
          warnList.splice(warnList.indexOf(warn), 1);

          // Send warn message to target if silent is false
          if (user) {
            user.send({ content: `## Your warning has been removed in ${guild.name}\n**Warning:** ${warn.reason}\n**Created:** <t:${Math.round(warn.created / 1000)}>` })
              .catch(err => {
                logger.warn(err);
              });
          }
          logger.info(`Unwarned user: ${user ? user.username : data.memberId} in ${guild.name}.`);
        }
      }

      // Set member data for warn
      await prisma.punishments.update({
        where: {
          memberId_guildId: {
            memberId: data.memberId,
            guildId: guild.id,
          },
        },
        data: {
          warns: JSON.stringify(warnList),
        },
      });
    }
  }
});
