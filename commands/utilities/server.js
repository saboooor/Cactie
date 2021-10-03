const { MessageEmbed } = require('discord.js');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'server',
	description: 'Discord server info',
	aliases: ['s', 'srv', 'guild'],
	cooldown: 10,
	guildOnly: true,
	async execute(message) {
		const owner = await message.guild.fetchOwner();
		const { body } = await got(message.guild.iconURL().replace('webp', 'png'), { encoding: null });
		const palette = await splashy(body);
		const Embed = new MessageEmbed()
			.setColor(palette[3])
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setFooter(`Owner: ${owner.user.username}`, owner.user.avatarURL())
			.setTimestamp();
		if (message.guild.description) Embed.addField('Description', message.guild.description);
		if (message.guild.vanityURLCode) Embed.addField('Vanity URL', `discord.gg/${message.guild.vanityURLCode}`);
		const timestamp = Math.round(message.guild.createdTimestamp / 1000);
		Embed
			.addField('Members', `${message.guild.memberCount}`)
			.addField('Channels', `${message.guild.channels.cache.size}`)
			.addField('Created At', `<t:${timestamp}>\n<t:${timestamp}:R>`);
		await message.reply({ embeds: [Embed] });
	},
};