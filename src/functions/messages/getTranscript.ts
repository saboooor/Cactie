import { Collection, Message, TextChannel } from 'discord.js';
import parseMentions from './parseMentions';

export default async function getTranscript(messages: Collection<string, Message<true>>) {
  const channel = messages.first()!.channel;
  const logs: Transcript = {
    guild: {
      name: channel.guild.name,
      icon: channel.guild.iconURL() ?? undefined,
    },
    channel: (channel as TextChannel).name,
    time: Date.now(),
    logs: [],
  };
  for (const msg of messages.values()) {
    await channel.guild.members.fetch(msg.author.id).catch(() => { return null; });
    const json: MessageJSON = {
      id: msg.id,
      time: Number(msg.createdAt),
      author: {
        avatar: msg.member?.avatarURL() ?? msg.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
        name: msg.member && msg.member.displayName ? msg.member.displayName : msg.author.tag ?? 'Unknown User',
        color: msg.member?.displayHexColor ?? undefined,
      },
      content: msg.content ? await parseMentions(msg.content, msg.guild!) : undefined,
      reactions: msg.reactions.cache.size > 0 ? msg.reactions.cache.map(r => ({ name: `${r.emoji}`, count: r.count })) : undefined,
      attachments: msg.attachments.size > 0 ? msg.attachments.map(a => ({ name: a.name, url: a.url })) : undefined,
      embeds: msg.embeds && msg.embeds.length ? [] : undefined,
    };
    if (msg.embeds && msg.embeds.length) {
      for (const MsgEmbed of msg.embeds) {
        const embedjson: EmbedJSON = {};
        if (MsgEmbed.color) embedjson.color = MsgEmbed.color.toString(16);
        if (MsgEmbed.author) embedjson.author = MsgEmbed.author;
        if (MsgEmbed.title) embedjson.title = MsgEmbed.title;
        if (MsgEmbed.description) embedjson.description = await parseMentions(MsgEmbed.description, msg.guild!);
        if (MsgEmbed.fields) {
          embedjson.fields = [];
          for (const field of MsgEmbed.fields) {
            const value = await parseMentions(field.value, msg.guild!);
            embedjson.fields.push({ name: field.name, value, inline: field.inline });
          }
        }
        if (MsgEmbed.thumbnail) embedjson.thumb = MsgEmbed.thumbnail.url;
        if (MsgEmbed.image) embedjson.image = MsgEmbed.image.url;
        if (MsgEmbed.footer) embedjson.footer = MsgEmbed.footer.text;
				json.embeds!.push(embedjson);
      }
    }
    logs.logs.push(json);
  }
  logs.logs.reverse();
  const balls = await fetch('https://transcript.luminescent.dev', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
  return (await balls.text()).replace(/"/g, '');
}

declare type Transcript = {
  guild: {
    name: string;
    icon?: string;
  };
	channel: string;
	time: number;
	logs: MessageJSON[];
}

declare type MessageJSON = {
  id: string;
	time: number;
	author: {
		avatar: string | null;
		name: string;
		color?: string;
	};
	content?: string;
  reactions?: {
    name: string;
    count: number;
  }[];
  attachments?: {
    name: string;
    url: string;
  }[];
	embeds?: EmbedJSON[];
}

declare type EmbedJSON = {
	color?: string;
	author?: {
		name: string;
		url?: string;
		icon_url?: string;
	};
	title?: string;
	description?: string;
	fields?: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
	thumb?: string;
	image?: string;
	footer?: string;
}