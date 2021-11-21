const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'removesetting',
	async execute(message, args, client) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		const prop = args[0];
		client.guilds.cache.forEach(guild => {
			client.settings.delete(guild.id, prop);
			client.logger.info(`Removed setting from ${guild.name}: ${prop}`);
		});
		const settings = await client.getSettings(message.guild.id);
		const srvconfig = Object.keys(settings).map(prop2 => {
			return `**${prop2}** \`${settings[prop2]}\``;
		});
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Settings')
			.setDescription(`${srvconfig.join('\n')}`);
		message.channel.send({ embeds: [Embed] });
	},
};