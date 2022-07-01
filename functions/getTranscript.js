module.exports = async function getTranscript(messages) {
	const logs = {
		channel: messages.first().channel.name,
		time: Date.now(),
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
		if (msg.content) json.content = msg.content;
		logs.logs.push(json);
	});
	logs.logs.reverse();
	const balls = await fetch('https://smhsmh.club/transcript', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
	return balls.statusText;
};