const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = {
	guilded: async function getTranscript(messages) {
		const logs = {
			channel: (await messages.first().client.channels.fetch(messages.first().channelId)).name,
			time: new Date().toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
			logs: [],
		};
		const unknownusers = [];
		for (const msg of messages) {
			msg[1].member = msg[1].client.members.cache.get(`${msg[1].serverId}:${msg[1].createdById}`);
			if (!msg[1].member && !unknownusers.includes(msg[1].createdById)) {
				msg[1].member = await msg[1].client.members.fetch(msg[1].serverId, msg[1].createdById)
					.catch(err => {
						unknownusers.push(msg[1].createdById);
						msg[1].client.logger.warn(err);
					});
			}
			const json = {
				time: new Date(msg[1].createdAt).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
				author: {
					color: 'ffffff',
					name: msg[1].member ? (msg[1].member.nickname ?? msg[1].member.user.name) : msg[1].createdById,
					avatar: msg[1].member ? msg[1].member.user.avatar : 'https://support.guilded.gg/hc/article_attachments/4421394253207/profile_4.png',
				},
				content: msg[1].content,
			};
			if (msg[1].raw.embeds) {
				json.embeds = [];
				msg[1].raw.embeds.forEach(MsgEmbed => {
					const embedjson = {};
					if (MsgEmbed.color) embedjson.color = MsgEmbed.color.toString(16);
					if (MsgEmbed.author) embedjson.author = MsgEmbed.author;
					if (MsgEmbed.title) embedjson.title = MsgEmbed.title;
					if (MsgEmbed.description) embedjson.description = MsgEmbed.description;
					if (MsgEmbed.fields) embedjson.fields = MsgEmbed.fields;
					if (MsgEmbed.thumbnail) embedjson.thumb = MsgEmbed.thumbnail.url;
					if (MsgEmbed.image) embedjson.image = MsgEmbed.image.url;
					if (MsgEmbed.footer) embedjson.footer = MsgEmbed.footer.text;
					json.embeds.push(embedjson);
				});
			}
			logs.logs.push(json);
		}
		logs.logs.reverse();
		const balls = await fetch('https://smhsmh.club/transcript', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
		return `${balls.statusText}`;
	},
	discord: async function getTranscript(messages) {
		const logs = {
			channel: messages.first().channel.name,
			time: new Date().toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
			logs: [],
		};
		messages.forEach(async msg => {
			const json = {
				time: new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
				author: {
					color: msg.member && msg.member.roles ? (msg.member.roles.highest ? msg.member.roles.highest.color.toString(16) : 'ffffff') : 'ffffff',
					name: msg.member && msg.member.displayName ? msg.member.displayName : msg.author.tag ?? 'Unknown User',
					avatar: msg.member && msg.member.avatarURL() ? msg.member.avatarURL() : msg.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
				},
			};
			if (msg.embeds && msg.embeds[0]) {
				json.embeds = [];
				msg.embeds.forEach(MsgEmbed => {
					const embedjson = {};
					if (MsgEmbed.color) embedjson.color = MsgEmbed.color.toString(16);
					if (MsgEmbed.author) embedjson.author = MsgEmbed.author.name;
					if (MsgEmbed.title) embedjson.title = MsgEmbed.title;
					if (MsgEmbed.description) embedjson.description = MsgEmbed.description;
					if (MsgEmbed.fields) embedjson.fields = MsgEmbed.fields;
					if (MsgEmbed.thumbnail) embedjson.thumb = MsgEmbed.thumbnail.url;
					if (MsgEmbed.image) embedjson.image = MsgEmbed.image.url;
					if (MsgEmbed.footer) embedjson.footer = MsgEmbed.footer.text;
					json.embeds.push(embedjson);
				});
			}
			if (msg.content) json.content = msg.content;
			logs.logs.push(json);
		});
		logs.logs.reverse();
		const balls = await fetch('https://smhsmh.club/transcript', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
		return balls.statusText;
	},
};