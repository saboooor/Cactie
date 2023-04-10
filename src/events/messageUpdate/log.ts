import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, TextChannel } from 'discord.js';
import { refresh } from '../../misc/emoji.json';
import getDiff from '../../functions/getDiff';

export default async (client: Client, oldMessage: Message, newMessage: Message) => {
  // Check if the message was sent by a bot or the content wasn't updated
  if ((newMessage.author && newMessage.author.bot) || oldMessage.content == newMessage.content) return;

  // Get current settings for the guild
  const srvconfig = await sql.getData('settings', { guildId: newMessage.guild!.id });

  // Check if log is enabled and channel is valid
  if (!['messageupdate', 'message', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
  const logchannel = newMessage.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel;
  if (!logchannel) return;

  // Convert createdTimestamp into seconds
  const createdTimestamp = Math.round(newMessage.createdTimestamp / 1000);

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: newMessage.author?.tag ?? 'Unknown User', iconURL: newMessage.author?.avatarURL() ?? undefined })
    .setTitle(`<:refresh:${refresh}> Message edited`)
    .setFields([
      { name: 'Channel', value: `${newMessage.channel}`, inline: true },
      { name: 'Sent at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
      { name: 'Before', value: `${oldMessage.content ?? 'None'}` },
    ]);

  // Get diff and if it generated successfully, add it to embed
  const diff = oldMessage.content && newMessage.content ? getDiff(oldMessage.content, newMessage.content) : null;
  if (diff && diff.length < 1024) logEmbed.addFields([{ name: 'Difference', value: diff }]);
  else logEmbed.addFields([{ name: 'After', value: `${newMessage.content ?? 'None'}` }]);

  // Create abovemessage button if above message is found
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setURL(newMessage.url)
        .setLabel('Go to message')
        .setStyle(ButtonStyle.Link),
    ]);

  // Send log
  logchannel.send({ embeds: [logEmbed], components: [row] }).catch(err => logger.error(err));
};