import { AttachmentBuilder, Client, Message, TextChannel } from 'discord.js';

export default async (client: Client, message: Message<false>) => {
  // If channel is DM,send the dm to the dms channel
  if (!message.channel.isDMBased()) return;
  const files = [];
  for (const attachment of message.attachments) {
    const response = await fetch(attachment[1].url, { method: 'GET' });
    const arrayBuffer = await response.arrayBuffer();
    const img = new AttachmentBuilder(Buffer.from(arrayBuffer))
      .setName(attachment[1].name);
    files.push(img);
  }
  let author = `${message.author}`;
  if (message.author.id == client.user?.id) author = `${client.user} > <@${message.channel.recipientId}>`;
  const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('849453797809455125')! as TextChannel;
  channel.send({ content: `**${author}** > ${message.content}`, files, embeds: message.embeds, components: message.components });
};