const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
const splashy = require('splashy');
const got = require('got');
module.exports = async (client, player, track) => {
	const channel = client.channels.cache.get(player.textChannel);
	const img = track.displayThumbnail('3') ? track.displayThumbnail('3') : 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/musical-note_1f3b5.png';
	const { body } = await got(img, { encoding: null });
	const palette = await splashy(body);
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`)
		.setThumbnail(img)
		.setColor(palette[3])
		.setTimestamp();
	return channel.send({ embeds: [thing] });
};