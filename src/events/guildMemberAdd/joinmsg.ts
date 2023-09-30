import { getGuildConfig } from '~/functions/prisma';
import { Client, GuildMember, TextChannel } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get server config
  const srvconfig = await getGuildConfig(member.guild.id);

  // Check if join message is set
  if (!srvconfig.joinmessage.message) return;

  // Check if system channel is set
  if (srvconfig.joinmessage.channel == 'false' && !member.guild.systemChannel) {
    const owner = await member.guild.fetchOwner();
    logger.warn(`${member.guild.name} (${owner.user.username}) doesn't have a system channel set!`);
    return owner.send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system messages channel or turn off join messages at https://cactie.luminescent.dev/dashboard/${member.guild.id}${client.user?.username.split(' ')[1] == 'Dev' ? '?dev' : ''}` })
      .catch(err => logger.warn(err));
  }

  // Send the join message to the system channel
  const channel = srvconfig.joinmessage.channel == 'false' ? member.guild.systemChannel! : member.guild.channels.cache.get(srvconfig.joinmessage.channel) as TextChannel;
  channel.send({
    content: srvconfig.joinmessage.message.replace(/{USER MENTION}/g, `${member}`).replace(/{USER TAG}/g, member.user.username),
    flags: srvconfig.joinmessage.silent ? ['4096'] : [],
  }).catch(err => logger.error(err));
  logger.info(`Sent join message to ${member.guild.name} for ${member.user.username}`);
};