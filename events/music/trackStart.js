const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { shuffle, pause, play, music } = require('../../lang/int/emoji.json');
const truncateString = (string, maxLength) =>
	string.length > maxLength
		? `${string.substring(0, maxLength)}…`
		: string;
module.exports = async (client, player, track) => {
	player.skipAmount = []; player.loopTrackAmount = [];
	player.loopQueueAmount = []; player.shuffleAmount = [];
	if (player.effectcurrentonly) {
		// Send empty filters to node
		await player.node.send({
			op: 'filters',
			guildId: player.guild,
		});
		player.effects = {};
		player.effectcurrentonly = false;
	}
	if (!player.voiceChannel) return;
	const guild = client.guilds.cache.get(player.guild);
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${track.requester.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);
	const StartEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **${lang.music.track.started}** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
		.setFooter({ text: track.requester.tag, iconURL: track.requester.displayAvatarURL() })
		.setThumbnail(track.img)
		.setColor(track.colors[0]);

	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('music_shuffle')
				.setEmoji({ id: shuffle })
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('music_pause')
				.setEmoji({ id: player.paused ? play : pause })
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setURL(`${client.dashboardDomain}/music`)
				.setEmoji({ id: music })
				.setLabel(lang.dashboard.name)
				.setStyle(ButtonStyle.Link),
		]);
	const components = [row];

	if (player.queue.length) {
		const selectMenuQueue = player.queue.slice(0, 24);
		const selectMenu = new SelectMenuBuilder()
			.setCustomId('music_skip')
			.setPlaceholder('Queue // Skip to...')
			.addOptions(
				selectMenuQueue.map((queueItem, i) => {
					return new SelectMenuOptionBuilder()
						.setLabel(`${i + 1}. ${truncateString(queueItem.title.split('\n')[0], 22)}`)
						.setDescription(truncateString(queueItem.title.split('\n')[1], 47) ?? 'Skip to this song')
						.setValue(`${i}`);
				}),
			);
		if (player.queue.length > 24) {
			selectMenu.addOptions([
				new SelectMenuOptionBuilder()
					.setLabel(`${player.queue.length - 24} more songs...`)
					.setDescription('Click here to show')
					.setValue('queue'),
			]);
		}
		const row2 = new ActionRowBuilder().addComponents([selectMenu]);
		components.push(row2);
	}

	client.logger.info(`Started playing ${track.title} [${convertTime(track.duration).replace('7:12:56', 'LIVE')}] in ${guild.name} (Requested by ${track.requester.tag})`);
	const NowPlaying = await guild.channels.cache
		.get(player.textChannel)
		.send({ embeds: [StartEmbed], components });
	player.setNowplayingMessage(NowPlaying);
	player.timeout = null;

	if (player.websockets) {
		player.websockets.forEach(ws => {
			ws.send(JSON.stringify({
				type: 'track',
				current: track,
				queue: player.queue,
			}));
		});
	}
};
