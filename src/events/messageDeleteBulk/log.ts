import { getGuildConfig } from '~/functions/prisma';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, Message, TextChannel } from 'discord.js';
import { no } from '~/misc/emoji.json';

export default async (client: Client, messages: Collection<string, Message<true>>, channel: TextChannel) => {
  // Get server config
  const srvconfig = await getGuildConfig(channel.guild!.id);

  // Check if log is enabled and send log
  if (!srvconfig.auditlogs.logs.messagedeletebulk && !srvconfig.auditlogs.logs.message && !srvconfig.auditlogs.logs.all) return;
  let logchannelId;
  if (srvconfig.auditlogs.logs.messagedeletebulk && srvconfig.auditlogs.logs.messagedeletebulk.channel != 'false') logchannelId = srvconfig.auditlogs.logs.messagedeletebulk.channel;
  else if (srvconfig.auditlogs.logs.message && srvconfig.auditlogs.logs.message.channel != 'false') logchannelId = srvconfig.auditlogs.logs.message.channel;
  else if (srvconfig.auditlogs.logs.all && srvconfig.auditlogs.logs.all.channel != 'false') logchannelId = srvconfig.auditlogs.logs.all.channel;
  else logchannelId = srvconfig.auditlogs.channel;
  const logchannel = channel.guild.channels.cache.get(logchannelId) as TextChannel | undefined;
  if (!logchannel) return;

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setTitle(`<:no:${no}> ${messages.size} Messages bulk-deleted`)
    .setFields([{ name: 'Channel', value: `${channel}` }]);

  // Create abovemessage button if above message is found
  const components = [];
  const aboveMessages = await channel.messages.fetch({ before: messages.first()!.id, limit: 1 }).catch(() => { return null; });
  if (aboveMessages && aboveMessages.first()) {
    const aboveMessage = aboveMessages.first()!;
    components.push(
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL(aboveMessage.url)
            .setLabel('Go to above message')
            .setStyle(ButtonStyle.Link),
        ]),
    );
  }

  // Send log
  logchannel.send({ embeds: [logEmbed], components }).catch(err => logger.error(err));
};