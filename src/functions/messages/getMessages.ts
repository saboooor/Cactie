import { Collection, FetchMessagesOptions, GuildTextBasedChannel, Message } from 'discord.js';

export default async function getMessages<InGuild extends boolean = boolean>(channel: GuildTextBasedChannel, limit: number | 'infinite' = 100) {
  const messagechunks = [];
  let remaining = limit;
  let last_id;
  if (limit != 'infinite' && limit <= 100) {
    const messages = await channel.messages.fetch({ limit: limit as number }).catch(err => { throw err; });
    messagechunks.push(messages);
  }
  else {
    while (remaining == 'infinite' || remaining > 0) {
      const options: FetchMessagesOptions = { limit: 100 };
      if (remaining != 'infinite' && remaining < 100) {
        options.limit = remaining as number;
        remaining = 0;
      }
      else if (remaining != 'infinite') {
        remaining = remaining - 100;
      }
      if (last_id) options.before = last_id;

      const messages = await channel.messages.fetch(options).catch(err => { throw err; });
      messagechunks.push(messages);
      last_id = messages.last()?.id;
      if (messages.size < 100) remaining = 0;
    }
  }

  return messagechunks as Collection<string, Message<InGuild>>[];
}