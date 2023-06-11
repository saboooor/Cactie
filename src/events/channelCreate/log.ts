import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, TextChannel } from 'discord.js';
import { yes } from '~/misc/emoji.json';

export default async (client: Client, channel: TextChannel) => {
  // Get server config
  const srvconfig = await getGuildConfig(channel.guild!.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.channelcreate && !srvconfig.auditlogs.logs.channel && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.channelcreate && srvconfig.auditlogs.logs.channelcreate.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channelcreate.channel;
  else if (srvconfig.auditlogs.logs.channel && srvconfig.auditlogs.logs.channel.channel != 'false') logchannelId = srvconfig.auditlogs.logs.channel.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = channel.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `# ${channel.name}` })
    .setTitle(`<:yes:${yes}> Channel created`);

  // Add category and topic if applicable
  if (channel.parent) logEmbed.addFields([{ name: 'Category', value: `${channel.parent}`, inline: true }]);
  if (channel.topic) logEmbed.addFields([{ name: 'Topic', value: channel.topic, inline: true }]);

  // Create button to go to channel
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setURL(channel.url)
        .setLabel('Go to channel')
        .setStyle(ButtonStyle.Link),
    ]);

  // Send log
  logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};