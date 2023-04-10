import { Client, GuildMember, TextChannel } from 'discord.js';

export default async (client: Client, member: GuildMember) => {
  // Get the guild settings
  const srvconfig = await sql.getData('settings', { guildId: member.guild.id });

  // Parse the JSON
  const joinMessageJSON = JSON.parse(srvconfig.joinmessage);

  // Check if join message is set
  if (!joinMessageJSON.message) return;

  // Check if system channel is set
  if (joinMessageJSON.channel == 'false' && !member.guild.systemChannel) {
    const owner = await member.guild.fetchOwner();
    logger.warn(`${member.guild.name} (${owner.user.tag}) doesn't have a system channel set!`);
    return owner.send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system messages channel or turn off join messages at https://${client.user!.username.toLowerCase().replace(/ /g, '')}.luminescent.dev` })
      .catch(err => logger.warn(err));
  }

  // Send the join message to the system channel
  const channel = joinMessageJSON.channel == 'false' ? member.guild.systemChannel! : member.guild.channels.cache.get(joinMessageJSON.channel) as TextChannel;
  channel.send({ content: joinMessageJSON.message.replace(/{USER MENTION}/g, `${member}`).replace(/{USER TAG}/g, member.user.tag) }).catch(err => logger.error(err));
  logger.info(`Sent join message to ${member.guild.name} for ${member.user.tag}`);
};