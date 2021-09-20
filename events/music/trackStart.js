const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
const splashy = require('splashy');
const got = require('got');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	const { body } = await got(track.displayThumbnail('3'), { encoding: null });
	const palette = await splashy(body);
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\` [<@${track.requester.id}>]`)
		.setThumbnail(track.displayThumbnail('3'))
		.setColor(palette[3])
		.setTimestamp();
	return channel.send({ embeds: [thing] });
};