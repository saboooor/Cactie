import { AttachmentBuilder, Client, ComponentType, ContainerBuilder, ForumChannel, Message, MessageFlags } from 'discord.js';
import getMessages from '~/functions/messages/getMessages';
import { sendAs } from '~/functions/sendAs';

export default async (client: Client, message: Message<false>) => {
  // get forum channel
  const guildId = '811354612547190794';
  const forumId = '1509039866317504666';
  const forum = client.guilds.cache.get(guildId)!.channels.cache.get(forumId) as ForumChannel;

  // Check if channel is DM for recieving, or if it's a thread in the forum for sending from the bot
  if (!message.channel.isDMBased() && message.channel.parent?.id != forumId) return;

  // Gather all attachments in the message and convert them to AttachmentBuilders so they can be sent in the thread or DM
  const files = [];
  for (const attachment of message.attachments) {
    const response = await fetch(attachment[1].url, { method: 'GET' });
    const arrayBuffer = await response.arrayBuffer();
    const img = new AttachmentBuilder(Buffer.from(arrayBuffer))
      .setName(attachment[1].name);
    files.push(img);
  }

  // If channel is DM, send the dm to the dms channel
  if (message.channel.isDMBased()) {
    // Get the recipient of the dm
    const recipient = 'recipient' in message.channel ? message.channel.recipient : null;
    if (!recipient) return;

    // Check if a thread already exists for this user in the foru
    const matches = await Promise.all(
      forum.threads.cache.values().map(async (t) => {
        const startMessage = await t.fetchStarterMessage();
        if (!startMessage) return null;

        const container =
          startMessage.components[0]?.type === ComponentType.Container
            ? startMessage.components[0]
            : null;

        const textDisplay =
          container?.components[2]?.type === ComponentType.TextDisplay
            ? container.components[2]
            : null;

        return textDisplay?.content === recipient.id ? t : null;
      }),
    );

    let thread = matches.find(Boolean);

    // If no thread exists for this user, create one with an embed of their user info as the first message
    if (!thread) {
      const userContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`# ${recipient}`),
          )
          .setThumbnailAccessory(thumbnail => thumbnail
            .setURL(recipient.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
          ),
        )
        .addTextDisplayComponents(
          textDisplay => textDisplay
            .setContent(`Created Account At <t:${Math.round(recipient.createdTimestamp / 1000)}>\n<t:${Math.round(recipient.createdTimestamp / 1000)}:R>`),
          textDisplay => textDisplay
            .setContent(`${recipient.id}`),
        );

      // Create the thread with the userContainer as the first message, and the recipient's ID as the content of the message so we can identify which thread belongs to which user later
      thread = await forum.threads.create({
        name: recipient.displayName,
        autoArchiveDuration: 1440,
        message: {
          components: [userContainer],
          flags: MessageFlags.IsComponentsV2,
        },
      });

      // if there is any backlog of messages in the dm, send them to the thread
      const dmMessages = await getMessages(message.channel, 'infinite');
      for (const chunk of dmMessages.reverse()) {
        for (const msg of [...chunk.values()].reverse()) {
          const content = msg.content || '\u200b';
          const embeds = msg.embeds;
          const components = msg.components;
          const attachments = [];
          for (const attachment of msg.attachments.values()) {
            const response = await fetch(attachment.url, { method: 'GET' });
            const arrayBuffer = await response.arrayBuffer();
            const img = new AttachmentBuilder(Buffer.from(arrayBuffer))
              .setName(attachment.name);
            attachments.push(img);
          }

          try {
            await sendAs(thread, {
              content,
              embeds,
              components,
              files: attachments,
              username: msg.author.username,
              avatarURL: msg.author.avatarURL() ?? undefined,
            });
          }
          catch (err) {
            logger.warn(`Failed to send message ${msg.id} in backlog for user ${recipient.id} in thread ${thread!.id}: ${err}`);
          }
        }
      }
    }

    sendAs(thread, {
      content: message.content,
      files,
      embeds: message.embeds,
      components: message.components,
      username: message.author.username,
      avatarURL: message.author.avatarURL() ?? undefined,
    });
  }
  // If channel is a thread in the forum, send the message to the user in the DMs
  else if (message.channel.isThread() && message.channel.parent?.id == forumId) {
    const startMessage = await message.channel.fetchStarterMessage();
    if (!startMessage) return;

    // Get the user ID from the container
    const containerFromMessage = startMessage.components[0]?.type === ComponentType.Container
      ? startMessage.components[0] : null;
    const textDisplayFromContainer = containerFromMessage?.components[2]?.type === ComponentType.TextDisplay
      ? containerFromMessage.components[2] : null;

    // If we can't find the user ID in the container, return
    const userId = textDisplayFromContainer?.content;
    if (!userId) return;

    // Send the message to the user in the DMs
    const user = client.users.cache.get(userId);
    if (!user || user.bot || message.author.bot) return;

    // Extract content, embeds, and components from the message and send them to the user in the DMs, along with any attachments
    const { content, embeds, components } = message;
    user.send({ content, files, embeds, components });
  }
};