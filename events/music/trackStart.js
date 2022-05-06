const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { play, shuffle, skip, music } = require('../../lang/int/emoji.json');
module.exports = async (client, player, track) => {
	player.skipAmount = []; player.loopTrackAmount = [];
	player.loopQueueAmount = []; player.shuffleAmount = [];
	if (!player.voiceChannel) return;
	const guild = client.guilds.cache.get(player.guild);
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${track.requester.id}'`);
	let lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);
	const StartEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **${lang.music.track.started}** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
		.setFooter({ text: track.requester.tag, iconURL: track.requester.displayAvatarURL() })
		.setThumbnail(track.img)
		.setColor(track.color);

	// Add button for skip
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('music_shuffle')
				.setEmoji({ id: shuffle })
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('music_skip')
				.setEmoji({ id: skip })
				.setStyle(ButtonStyle.Secondary),
		]);
	if (client.user.id == '848775888673439745') {
		row.addComponents([
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club/music')
				.setEmoji({ id: music })
				.setLabel(lang.dashboard.name)
				.setStyle(ButtonStyle.Link),
		]);
	}
	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [StartEmbed], components: [row] });
	player.setNowplayingMessage(NowPlaying);
	player.timeout = null;
};