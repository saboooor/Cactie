const { createPaste } = require('hastebin');
module.exports = async function getTranscript(messages) {
	const logs = [];
	messages.forEach(async msg => {
		const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
		msg.embeds.forEach(MsgEmbed => {
			if (MsgEmbed.footer) logs.push(`${MsgEmbed.footer.text}`);
			MsgEmbed.fields.forEach(field => {
				logs.push(`${field.value}`);
				logs.push(`${field.name}`);
			});
			if (MsgEmbed.description) logs.push(`${MsgEmbed.description}`);
			if (MsgEmbed.title) logs.push(`${MsgEmbed.title}`);
			if (MsgEmbed.author) logs.push(`${MsgEmbed.author.name}`);
		});
		if (msg.content) logs.push(`${msg.content}`);
		logs.push(`\n[${time}] ${msg.author.tag}`);
	});
	logs.reverse();
	return await createPaste(logs.join('\n'), { server: 'https://bin.birdflop.com' });
};