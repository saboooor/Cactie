const { Embed, ActionRow, ButtonComponent } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const solenolyrics = require('solenolyrics');
const msg = require('../../lang/en/msg.json');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	player.lyrics = await solenolyrics.requestLyricsFor(track.title.split('(')[0] ? track.title.split('(')[0] : track.title)
		.catch(err => { client.logger.warn(err); });
	if (!player.lyrics) player.lyrics = 'Lyrics not found.';
	if (!player.voiceChannel) return;
	const thing = new Embed()
		.setDescription(`▶️ **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`)
		.setThumbnail(track.img)
		.setColor(track.color)
		.setTimestamp();

	// Add button for skip
	const row = new ActionRow()
		.addComponents(
			new ButtonComponent()
				.setCustomId('music_skip')
				.setEmoji('⏭️')
				.setLabel(msg.music.skip.name)
				.setStyle('SECONDARY'),
		);
	const guild = client.guilds.cache.get(player.guild);
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [thing], components: [row] });
	player.setNowplayingMessage(NowPlaying);
};