import { Collection, Message, TextChannel } from 'discord.js';
import parseMentions from './parseMentions';

export default async function getTranscript(messages: Collection<string, Message>) {
  const channel = messages.first()!.channel;
  const logs: Transcript = {
    channel: (channel as TextChannel).name ?? 'No Name',
    time: Date.now(),
    logs: [],
  };
  for (const msg of messages.values()) {
    const json: MessageJSON = {
      time: new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
      author: {
        color: msg.member && msg.member.roles ? (msg.member.roles.highest ? msg.member.roles.highest.color.toString(16) : 'ffffff') : 'ffffff',
        name: msg.member && msg.member.displayName ? msg.member.displayName : msg.author.tag ?? 'Unknown User',
        avatar: msg.member && msg.member.avatarURL() ? msg.member.avatarURL() : msg.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
    };
    if (msg.embeds && msg.embeds.length) {
      json.embeds = [];
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
    if (msg.content) json.content = await parseMentions(msg.content, msg.guild!);
    logs.logs.push(json);
  }
  logs.logs.reverse();
  const balls = await fetch('https://transcript.luminescent.dev', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
  return (await balls.text()).replace(/"/g, '');
}

declare type Transcript = {
	channel: string;
	time: number;
	logs: MessageJSON[];
}

declare type MessageJSON = {
	time: string;
	author: {
		color: string;
		name: string;
		avatar: string | null;
	};
	content?: string;
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