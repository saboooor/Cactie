const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { play, shuffle, skip, music } = require('../../lang/int/emoji.json');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	player.lyrics = null;
	if (!player.lyrics) player.lyrics = 'Lyrics not found.';
	if (!player.voiceChannel) return;
	const thing = new MessageEmbed()
		.setDescription(`<:play:${play}> **Started Playing** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
		.setFooter({ text: track.requester.tag, iconURL: track.requester.displayAvatarURL() })
		.setThumbnail(track.img)
		.setColor(track.color)
		.setTimestamp();

	// Add button for skip, shuffle, and dashboard
	const row = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('music_shuffle')
				.setEmoji(shuffle)
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('music_skip')
				.setEmoji(skip)
				.setStyle('SECONDARY'),
		]);
	if (client.user.id == '765287593762881616') {
		row.addComponents(
			new MessageButton()
				.setURL('https://pup.smhsmh.club/music')
				.setEmoji(music)
				.setLabel('Music Control Panel')
				.setStyle('LINK'),
		);
	}

	const guild = client.guilds.cache.get(player.guild);
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [thing], components: [row] });
	player.setNowplayingMessage(NowPlaying);
};