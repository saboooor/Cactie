const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['s', 'srv', 'guild'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const owner = await message.guild.fetchOwner();
			const srvEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(message.guild.name)
				.setThumbnail(message.guild.iconURL())
				.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL() });
			if (message.guild.description) srvEmbed.addFields({ name: 'Description', value: message.guild.description });
			if (message.guild.vanityURLCode) srvEmbed.addFields({ name: 'Vanity URL', value: `discord.gg/${message.guild.vanityURLCode}` });
			const timestamp = Math.round(message.guild.createdTimestamp / 1000);
			srvEmbed
				.addFields({ name: 'Members', value: `${message.guild.memberCount}` })
				.addFields({ name: 'Channels', value: `${message.guild.channels.cache.size}` })
				.addFields({ name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` });
			await message.reply({ embeds: [srvEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};