import { AttachmentBuilder, Client, Message, TextChannel } from 'discord.js';
const forumId = '1182123441491558511';

export default async (client: Client, message: Message<false>) => {
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

  const branch = client.user?.username.split(' ')[1] ? `-${client.user.username.split(' ')[1].toLowerCase()}` : '';

  // If channel is DM,send the dm to the dms channel
  if (message.channel.isDMBased()) {
    let thread = forum.threads.cache.find(t => t.name.endsWith(message.author.id + branch));

    if (!thread) {
      thread = await forum.threads.create({
        name: message.author.id + branch,
        autoArchiveDuration: 1440,
        message: {
          content: `${message.author} **@${message.author.username}**`,
        },
      });
    }

    let author = `${message.author}`;
    if (message.author.id == client.user?.id) author = `${client.user} > <@${message.channel.recipientId}>`;
    thread.send({ content: `**${author}** > ${message.content}`, files, embeds: message.embeds, components: message.components });
  }
  else if (message.channel.parent?.id == forumId) {
    let id = message.channel.name;
    if (branch != '') {
      if (!id.endsWith(branch)) return;
      id = id.replace(branch, '');
    }

    const user = await client.users.cache.get(id);
    if (!user || user.bot || message.author.bot) return;
    const { content, embeds, components } = message;
    user.send({ content, files, embeds, components });
  }
};