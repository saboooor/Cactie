const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'removesetting',
	description: 'Remove a guild setting',
	async execute(message, args, client) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		const prop = args[0];
		client.guilds.cache.forEach(guild => {
			client.settings.delete(guild.id, prop);
			client.logger.info(`Removed setting from ${guild.name}: ${prop}`);
		});
		const srvconfig = Object.keys(client.settings.get(message.guild.id)).map(prop2 => {
			return `**${prop2}** \`${client.settings.get(message.guild.id)[prop2]}\``;
		});
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Settings')
			.setDescription(`${srvconfig.join('\n')}`);
		message.channel.send({ embeds: [Embed] });
	},
};