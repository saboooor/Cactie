import { AttachmentBuilder, Client, Message, TextChannel } from 'discord.js';

export default async (client: Client, message: Message<false>) => {
  const forumId = client.user?.username.split(' ')[1] ? '1182176470374826024' : '1182123441491558511';
  if (!message.channel.isDMBased() && message.channel.parent?.id != forumId) return;
  const forum = client.guilds.cache.get('811354612547190794')!.channels.cache.get(forumId) as TextChannel;
  const files = [];

  for (const attachment of message.attachments) {
    const response = await fetch(attachment[1].url, { method: 'GET' });
    const arrayBuffer = await response.arrayBuffer();
    const img = new AttachmentBuilder(Buffer.from(arrayBuffer))
      .setName(attachment[1].name);
    files.push(img);
  }

  // If channel is DM,send the dm to the dms channel
  if (message.channel.isDMBased()) {
    let thread = forum.threads.cache.find(t => t.name.endsWith(message.author.id));

    if (!thread) {
      const pfp = [];
      if (message.author.avatarURL()) {
        const response = await fetch(message.author.avatarURL(), { method: 'GET' });
        const arrayBuffer = await response.arrayBuffer();
        pfp.push(
          new AttachmentBuilder(Buffer.from(arrayBuffer))
            .setName(message.author.username + '.png'),
        );
      }

      thread = await forum.threads.create({
        name: message.author.id,
        autoArchiveDuration: 1440,
        message: {
          content: `${message.author} **@${message.author.username}**`,
          files: pfp,
        },
      });
    }

    const author = message.author.id == client.user?.id ? message.channel.recipient : '';
    const { content, embeds, components } = message;
    thread.send({ content: `${author} ${content}`, files, embeds, components });
  }
  else if (message.channel.parent?.id == forumId) {
    const user = await client.users.cache.get(message.channel.name);
    if (!user || user.bot || message.author.bot) return;
    const { content, embeds, components } = message;
    user.send({ content, files, embeds, components });
  }
};