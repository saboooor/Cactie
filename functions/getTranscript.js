const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = async function getTranscript(messages) {
	const logs = {
		channel: messages.first().channel.name,
		time: new Date().toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
		logs: [],
	};
	messages.forEach(async msg => {
		const json = {
			time: new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
			author: {
				color: msg.member ? (msg.member.roles.highest ? msg.member.roles.highest.color.toString(16) : 'ffffff') : 'ffffff',
				name: msg.author.tag,
				avatar: msg.author.displayAvatarURL(),
			},
		};
		if (msg.embeds[0]) json.embeds = [];
		if (msg.content) json.content = msg.content;
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
		logs.logs.push(json);
	});
	logs.logs.reverse();
	const balls = await fetch('https://smhsmh.club/transcript', { method: 'POST', body: JSON.stringify(logs), headers: { 'Content-Type': 'application/json' } });
	return balls.statusText;
};