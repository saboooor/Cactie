import {
  Webhook,
  type GuildTextBasedChannel,
  type MessageCreateOptions,
} from 'discord.js';

const webhookCache = new Map<string, Webhook>();

async function getWebhook(channel: GuildTextBasedChannel): Promise<Webhook> {
  const channelToFetch = 'fetchWebhooks' in channel ? channel : channel.parent;
  if (!channelToFetch) throw new Error('Channel must be a text channel or have a parent that is a text channel');

  const cached = webhookCache.get(channelToFetch.id);
  if (cached) return cached;

  const webhooks = await channelToFetch.fetchWebhooks();
  let webhook = webhooks?.find(
    (w) => w.owner?.id === channel.client.user.id,
  );

  if (!webhook) {
    webhook = await channelToFetch.createWebhook({
      name: channel.client.user.displayName || channel.client.user.username,
    });
  }

  webhookCache.set(channelToFetch.id, webhook);
  return webhook;
}

type SendAsOptions = {
  username: string;
  avatarURL?: string;
} & MessageCreateOptions;

export async function sendAs(
  channel: GuildTextBasedChannel,
  options: SendAsOptions,
) {
  const webhook = await getWebhook(channel);

  if (typeof options === 'string') {
    return webhook.send({
      content: options,
    });
  }

  const { username, avatarURL, ...message } = options;

  return webhook.send({
    threadId: channel.isThread() ? channel.id : undefined,
    ...message,
    username,
    avatarURL,
  });
}