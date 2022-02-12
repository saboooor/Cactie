const { Embed } = require('discord.js');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['s', 'srv', 'guild'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			const owner = await message.guild.fetchOwner();
			const srvEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(message.guild.name)
				.setThumbnail(message.guild.iconURL({ dynamic : true }))
				.setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL({ dynamic : true }) })
				.setTimestamp();
			if (message.guild.description) srvEmbed.addField({ name: 'Description', value: message.guild.description });
			if (message.guild.vanityURLCode) srvEmbed.addField({ name: 'Vanity URL', value: `discord.gg/${message.guild.vanityURLCode}` });
			const timestamp = Math.round(message.guild.createdTimestamp / 1000);
			srvEmbed
				.addField({ name: 'Members', value: `${message.guild.memberCount}` })
				.addField({ name: 'Channels', value: `${message.guild.channels.cache.size}` })
				.addField({ name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` });
			await message.reply({ embeds: [srvEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};