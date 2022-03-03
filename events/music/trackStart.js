const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const solenolyrics = require('solenolyrics');
const { play, shuffle, skip, music } = require('../../lang/int/emoji.json');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.clearQueueAmount = null;
	player.loopTrackAmount = null; player.loopQueueAmount = null;
	player.shuffleAmount = null;
	player.lyrics = await solenolyrics.requestLyricsFor(track.title.split('(')[0] ? track.title.split('(')[0] : track.title)
		.catch(err => { client.logger.warn(err); });
	if (!player.lyrics) player.lyrics = 'Lyrics not found.';
	if (!player.voiceChannel) return;
	const thing = new Embed()
		.setDescription(`<:play:${play}> **Started Playing** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
		.setFooter({ text: track.requester.tag, iconURL: track.requester.displayAvatarURL() })
		.setThumbnail(track.img)
		.setColor(track.color)
		.setTimestamp();

	// Add button for skip
	const row = new ActionRow()
		.addComponents(
			new ButtonComponent()
				.setCustomId('music_shuffle')
				.setEmoji({ id: shuffle })
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('music_skip')
				.setEmoji({ id: skip })
				.setStyle(ButtonStyle.Secondary),
		);
	if (client.user.id == '765287593762881616') {
		row.addComponents(
			new ButtonComponent()
				.setURL('https://pup.smhsmh.club/music')
				.setEmoji({ id: music })
				.setLabel('Music Control Panel')
				.setStyle(ButtonStyle.Link),
		);
	}
	const guild = client.guilds.cache.get(player.guild);
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [thing], components: [row] });
	player.setNowplayingMessage(NowPlaying);
};