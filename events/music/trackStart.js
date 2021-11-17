const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`)
		.setThumbnail(track.img)
		.setColor(track.color)
		.setTimestamp();
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('07:12:56', 'LIVE')}] in ${client.guilds.cache.get(player.guild).name} (Requested by ${track.requester.tag})`);
	return channel.send({ embeds: [thing] });
};