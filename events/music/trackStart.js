const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { play, shuffle, skip, music } = require('../../lang/int/emoji.json');
module.exports = async (client, player, track) => {
	player.skipAmount = null; player.loopTrackAmount = null;
	player.loopQueueAmount = null; player.shuffleAmount = null;
	if (!player.voiceChannel) return;
	const StartEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **Started Playing** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
		.setFooter({ text: track.requester.tag, iconURL: track.requester.displayAvatarURL() })
		.setThumbnail(track.img)
		.setColor(track.color);

	// Add button for skip
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('music_shuffle')
				.setEmoji({ id: shuffle })
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('music_skip')
				.setEmoji({ id: skip })
				.setStyle(ButtonStyle.Secondary),
		);
	if (client.user.id == '848775888673439745') {
		row.addComponents(
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club/music')
				.setEmoji({ id: music })
				.setLabel('Music Control Panel')
				.setStyle(ButtonStyle.Link),
		);
	}
	const guild = client.guilds.cache.get(player.guild);
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [StartEmbed], components: [row] });
	player.setNowplayingMessage(NowPlaying);
	player.timeout = null;
};