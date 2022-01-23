const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const solenolyrics = require('solenolyrics');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	player.lyrics = track.title.split('(')[0] ? await solenolyrics.requestLyricsFor(track.title.split('(')[0]) : await solenolyrics.requestLyricsFor(track.title);
	if (!player.lyrics) player.lyrics = 'Lyrics not found.';
	const thing = new MessageEmbed()
		.setDescription(`▶️ **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`)
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
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${client.guilds.cache.get(player.guild).name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [thing], components: [row] });
	player.setNowplayingMessage(NowPlaying);
};