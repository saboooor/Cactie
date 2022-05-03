const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = async function getTranscript(messages) {
	const channel = messages.first().client.type.name == 'guilded' ? await messages.first().client.channels.fetch(messages.first().channelId) : await messages.first().channel;
	const logs = {
		channel: channel.name,
		time: new Date().toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
		logs: [],
	};
	messages.forEach(async msg => {
		if (msg.client.type.name == 'guilded') {
			msg.member = msg.client.members.cache.get(`${msg.serverId}:${msg.createdById}`);
			if (!msg.member) msg.member = await msg.client.members.fetch(msg.serverId, msg.createdById).catch(err => msg.client.logger.warn(err));
		}
		const json = {
			time: new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
			author: {
				color: (msg.member && msg.member.roles) ? (msg.member.roles.highest ? msg.member.roles.highest.color.toString(16) : 'ffffff') : 'ffffff',
				name: msg.member ? (msg.member.displayName ?? msg.member.nickname) ?? (msg.member.user.tag ?? msg.member.user.name) : (msg.author ? msg.author.tag : msg.createdById ?? 'Unknown'),
				avatar: msg.client.type.name == 'discord' ? (msg.member && msg.member.avatarURL() ? msg.member.avatarURL() : msg.author.avatarURL()) : msg.member ? msg.member.user.avatar : '',
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
};