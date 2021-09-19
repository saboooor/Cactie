const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\` [<@${track.requester.id}>]`)
		.setThumbnail(track.displayThumbnail('3'))
		.setColor(Math.round(Math.random() * 16777215))
		.setTimestamp();
	return channel.send({ embeds: [thing] });
};