const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	let img = track.displayThumbnail ? track.displayThumbnail('hqdefault') : DefaultThumbnail;
	if (!img) img = DefaultThumbnail;
	const { body } = await got(img, { encoding: null });
	const palette = await splashy(body);
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`)
		.setThumbnail(img)
		.setColor(palette[3])
		.setTimestamp();
	return channel.send({ embeds: [thing] });
};