import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, TextChannel } from 'discord.js';
import { no } from '../../misc/emoji.json';

export default async (client: Client, message: Message<true>) => {
  // Check if the message was sent by a bot
  if (message.author && message.author.bot) return;

  // Get current settings for the guild
  const srvconfig = await sql.getData('settings', { guildId: message.guild?.id });

  // Check if log is enabled and channel is valid
  if (!['messagedelete', 'message', 'all'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) return;
  const logchannel = message.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
  if (!logchannel) return;

  // Convert createdTimestamp into seconds
  const createdTimestamp = Math.round(message.createdTimestamp / 1000);

  // Create log embed
  const logEmbed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: message.author?.tag ?? 'Unknown User', iconURL: message.author?.avatarURL() ?? undefined })
    .setTitle(`<:no:${no}> Message deleted`)
    .setFields([
      { name: 'Channel', value: `${message.channel}`, inline: true },
      { name: 'Sent at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
    ]);

  // Set the embeds list
  const embeds = [logEmbed];

  // Add content if there is any
  if (message.content) logEmbed.addFields([{ name: 'Content', value: `${message.content}` }]);

  // Add attachments
  if (message.attachments.size) {
    const images = message.attachments.filter(a => a.contentType?.split('/')[0] == 'image');
    const files = message.attachments.filter(a => a.contentType?.split('/')[0] != 'image');
    if (images.size) {
      logEmbed.addFields([{ name: 'Images', value: `${images.size}` }]);
      logEmbed.setImage(images.first()!.url);
      images.delete(images.first()!.id);
      if (images.size) {
        images.forEach(img => {
          const imgEmbed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setImage(img.url);
          embeds.push(imgEmbed);
        });
      }
    }
    if (files.size) logEmbed.addFields([{ name: 'Files', value: `${files.map(f => `**${f.name}** ${f.size / 1024 / 1024} MB\n${f.url}\n`)}` }]);
  }

  // Add embeds if there is any
  if (message.embeds.length) {
    const embedBuilders = message.embeds.map(e => new EmbedBuilder(e.toJSON()));
    embeds.push(...embedBuilders);
    logEmbed.addFields([{ name: 'Embeds', value: `${message.embeds.length} Below`, inline: true }]);
  }

  // Create abovemessage button if above message is found
  const components = [];
  const aboveMessages = await message.channel.messages.fetch({ before: message.id, limit: 1 }).catch(() => { return null; });
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

  // Check if there's more than 10 messages and split into multiple messages
  while (embeds.length > 10) {
    logchannel.send({ embeds: embeds.splice(0, 9) });
  }

  // Send log
  logchannel.send({ embeds, components }).catch(err => logger.error(err));
};