const { MessageEmbed } = require('discord.js');
const { warn } = require('../../config/emoji.json');
module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor(Math.round(Math.random() * 16777215))
		.setDescription(`${warn} **Music queue ended**`)
		.setFooter(client.user.username, client.user.displayAvatarURL());
	channel.send({ embeds: [thing] });
};