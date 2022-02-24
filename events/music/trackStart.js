const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const msg = require('../../lang/en/msg.json');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	player.lyrics = null;
	if (!player.lyrics) player.lyrics = 'Lyrics not found.';
	if (!player.voiceChannel) return;
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