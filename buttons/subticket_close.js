const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'close_subticket',
	async execute(interaction, client) {
		const messages = await interaction.channel.messages.fetch({ limit: 100 });
		const logs = [];
		await messages.forEach(async msg => {
			const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
			logs.push(`[${time}] ${msg.author.tag}\n${msg.content}`);
		});
		logs.reverse();
		const link = await hastebin.createPaste(logs.join('\n\n'), { server: 'https://bin.birdflop.com' });
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${interaction.channel.name}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${interaction.user}`);
		client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		interaction.channel.parent.send({ embeds: [Embed] })
			.catch(error => { client.logger.error(error); });
		client.logger.info(`Closed subticket #${interaction.channel.name}`);
		await interaction.channel.delete();
	},
};