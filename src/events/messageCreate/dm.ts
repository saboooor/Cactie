import { AttachmentBuilder, Client, Message, TextChannel } from 'discord.js';

export default async (client: Client, message: Message<false>) => {
  // If channel is DM,send the dm to the dms channel
  if (!message.channel.isDMBased()) return;

  const forum = client.guilds.cache.get('811354612547190794')!.channels.cache.get('1182123441491558511') as TextChannel;
  let thread = forum.threads.cache.find(t => t.name.endsWith(message.author.id));

  if (!thread) {
    thread = await forum.threads.create({
      name: `${message.author.id}`,
      autoArchiveDuration: 1440,
    });
    await thread.send({
      content: `${message.author}\n${message.author.username}`,
    });
  }

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
  thread.send({ content: `**${author}** > ${message.content}`, files, embeds: message.embeds, components: message.components });
};