const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'transcript',
	description: 'Get a transcript of the current channel',
	async execute(message, user, client) {
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const logs = [];
		await messages.forEach(async msg => {
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
		const link = await hastebin.createPaste(logs.join('\n'), { server: 'https://bin.birdflop.com' });
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Transcript of ${message.channel.name}`)
			.setDescription(`${link}.txt`);
		client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
		message.reply({ embeds: [Embed] })
			.catch(error => { client.logger.error(error); });
	},
};