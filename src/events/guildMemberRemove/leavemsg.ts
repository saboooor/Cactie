import prisma from '~/functions/prisma';
import { Client, GuildMember, TextChannel } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get server config
  const srvconfig = await prisma.settings.findUnique({ where: { guildId: member.guild!.id } });
  if (!srvconfig) return;

  // Parse the JSON
  const leaveMessageJSON = JSON.parse(srvconfig.leavemessage);

  // Check if leave message is set
  if (!leaveMessageJSON.message) return;

  // Check if system channel is set
  if (leaveMessageJSON.channel == 'false' && !member.guild.systemChannel) {
    const owner = await member.guild.fetchOwner();
    logger.warn(`${member.guild.name} (${owner.user.tag}) doesn't have a system channel set!`);
    return owner.send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system messages channel or turn off leave messages at https://cactie.luminescent.dev/dashboard/${client.user!.username.split(' ')[1] == 'Dev' ? 'dev' : 'master'}/${member.guild!.id}` })
      .catch(err => logger.warn(err));
  }

  // Send the leave message to the system channel
  const channel = leaveMessageJSON.channel == 'false' ? member.guild.systemChannel! : member.guild.channels.cache.get(leaveMessageJSON.channel) as TextChannel;
  channel.send({ content: leaveMessageJSON.message.replace(/{USER MENTION}/g, `${member}`).replace(/{USER TAG}/g, member.user.tag) }).catch(err => logger.error(err));
  logger.info(`Sent leave message to ${member.guild.name} for ${member.user.tag}`);
};