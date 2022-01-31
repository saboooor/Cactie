const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['s', 'srv', 'guild'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const owner = await message.guild.fetchOwner();
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(message.guild.name)
				.setThumbnail(message.guild.iconURL({ dynamic : true }))
				.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL({ dynamic : true }) })
				.setTimestamp();
			if (message.guild.description) Embed.addField('Description', message.guild.description);
			if (message.guild.vanityURLCode) Embed.addField('Vanity URL', `discord.gg/${message.guild.vanityURLCode}`);
			const timestamp = Math.round(message.guild.createdTimestamp / 1000);
			Embed
				.addField('Members', `${message.guild.memberCount}`)
				.addField('Channels', `${message.guild.channels.cache.size}`)
				.addField('Created At', `<t:${timestamp}>\n<t:${timestamp}:R>`);
			await message.reply({ embeds: [Embed] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};