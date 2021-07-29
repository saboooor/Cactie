const hastebin = require('hastebin');
module.exports = async function getTranscript(messages) {
	const logs = [];
	messages.forEach(async msg => {
		const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
		msg.embeds.forEach(embed => {
			if (embed.footer) logs.push(`${embed.footer.text}`);
			embed.fields.forEach(field => {
				logs.push(`${field.value}`);
				logs.push(`${field.name}`);
			});
			if (embed.description) logs.push(`${embed.description}`);
			if (embed.title) logs.push(`${embed.title}`);
			if (embed.author) logs.push(`${embed.author.name}`);
		});
		if (msg.content) logs.push(`${msg.content}`);
		logs.push(`\n[${time}] ${msg.author.tag}`);
	});
	logs.reverse();
	return await hastebin.createPaste(logs.join('\n'), { server: 'https://bin.birdflop.com' });
};