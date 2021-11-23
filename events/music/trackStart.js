const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { play } = require('../../config/emoji.json');
const { getColor } = require('colorthief');
const rgb2hex = require('../../functions/rgbhex');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	if (!track.img) {
		const Searched = await player.search(track.title);
		const a = Searched.tracks[0];
		if (a && a.displayThumbnail) {
			track.img = a.displayThumbnail('hqdefault');
			track.color = rgb2hex(await getColor(track.img));
		}
	}
	const thing = new MessageEmbed()
		.setDescription(`${play} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\` [${track.requester}]`)
		.setThumbnail(track.img)
		.setColor(track.color)
		.setTimestamp();

	// Add button for skip
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('music_skip')
				.setEmoji('⏭️')
				.setLabel('Skip')
				.setStyle('SECONDARY'),
		);
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('07:12:56', 'LIVE')}] in ${client.guilds.cache.get(player.guild).name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [thing], components: [row] });
	player.setNowplayingMessage(NowPlaying);
};