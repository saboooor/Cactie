const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { convertTime } = require('./convert.js');
const getColors = require('get-image-colors');
const getCover = require('./getCover.js');
const { play, music, warn, leave, no, srch, refresh, join } = require('../../lang/int/emoji.json');
module.exports = async function playSongs(requester, message, args, client, lang, top, query) {
	// Get current voice channel and player, if player doesn't exist, create it in that channel
	const { channel } = requester.voice;
	let player = client.manager.get(message.guild.id);
	if (!player) {
		player = client.manager.create({
			guild: message.guild.id,
			voiceChannel: channel.id,
			textChannel: message.guild.features.includes('TEXT_IN_VOICE_ENABLED') ? channel.id : message.channel.id,
			volume: 50,
			selfDeafen: true,
		});

		// Send message to channel
		const JoinEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setDescription(`<:in:${join}> **${lang.music.join.ed.replace('{vc}', `${channel}`).replace('{txt}', `${channel}`)}**`);
		message.channel.send({ embeds: [JoinEmbed] });
	}

	// If player isn't connected, connect it
	if (player.state != 'CONNECTED') player.connect();

	// Get search results from YouTube, Spotify, or Apple Music
	const search = args.join(' '); const songs = [];

	// Create embed for responses
	const PlayEmbed = new EmbedBuilder().setColor(0x2f3136);
	const playMsg = await message.reply({ content: `<:srch:${srch}> **${lang.music.search.ing.replace('{query}', search)}**` });

	// Create undo button
	const undo = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('music_undo')
				.setEmoji({ id: leave })
				.setLabel(lang.undo)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('music_search')
				.setEmoji({ id: srch })
				.setLabel(lang.music.search.notright)
				.setStyle(ButtonStyle.Secondary),
		]);
	const row = [];

	// Search YouTube
	const Searched = await player.search(search);

	if (query) {
		const tracks = Searched.tracks.slice(0, 5);
		const tracklist = tracks.map(track => {
			return `**${tracks.indexOf(track) + 1}** • [${track.title}\n${track.author}](${track.uri}) \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\``;
		});
		PlayEmbed.setDescription(`<:srch:${srch}> **${lang.music.search.results}**\n${tracklist.join('\n')}`);

		const balls = new ActionRowBuilder();
		for (let number = 1; number <= 5; number++) {
			balls.addComponents([
				new ButtonBuilder()
					.setCustomId(`${number}`)
					.setLabel(`${number}`)
					.setStyle(ButtonStyle.Secondary),
			]);
		}
		row.push(balls);
		await playMsg.edit({ content: `<:srch:${srch}> ${lang.music.search.pick}\n\`${search}\``, embeds: [PlayEmbed], components: row });

		const collector = playMsg.createMessageComponentCollector({ time: 60000 });
		collector.on('collect', async interaction => {
			// Check if the user is the requester
			interaction.deferUpdate();
			playSongs(requester, playMsg, [Searched.tracks[interaction.customId - 1].uri], client, lang, top, false);
			await playMsg.edit({ content: `<:play:${play}> **${lang.music.search.picked.replace('{num}', interaction.customId)}**`, embeds: [], components: [] })
				.then(() => collector.stop());
		});

		// When the collector stops, remove the undo button from it
		collector.on('end', () => {
			if (playMsg.content.startsWith(`<:play:${play}> `)) return;
			playMsg.edit({ content: `<:alert:${warn}> **${lang.music.search.timeout}**`, embeds: [], components: [] })
				.catch(err => client.logger.warn(err));
		});

		return;
	}

	// Get first track and check if result is not found or a playlist, if not, then just add the song
	const track = Searched.tracks[0];
	if (Searched.loadType === 'NO_MATCHES' || !track) {
		// There's no result for the search, send error message
		PlayEmbed.setColor(0xE74C3C).setDescription(`<:alert:${warn}> ${lang.music.search.failed}`);
		return playMsg.edit({ content: null, embeds: [PlayEmbed] });
	}
	else if (Searched.loadType == 'PLAYLIST_LOADED') {
		// Add description to embed and push every song in the playlist
		PlayEmbed.setDescription(`<:music:${music}> **${lang.music.added.playlist[top ? 'top' : 'end']}** \`[${Searched.tracks.length} / ${convertTime(Searched.playlist.duration)}]\`\n[${Searched.playlist.name}](${search})`)
			.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() });
		await Searched.tracks.forEach(song => songs.push(song));
		row.push(undo);
	}
	else {
		// Add description to embed and the song
		PlayEmbed.setDescription(`<:music:${music}> **${lang.music.added.song[top ? 'top' : 'end']}** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
			.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() });
		songs.push(Searched.tracks[0]);
		row.push(undo);
	}

	// Playtop doesn't really matter if queue is empty
	top = player.queue.current && top;

	// If playtop, reverse list of songs to add them in the right order
	if (top) songs.reverse();

	// Found songs, update message while processing
	playMsg.edit({ content: `<:play:${play}> **${lang.music.search.found.replace('{query}', search)}**\n<:refresh:${refresh}> **Processing songs... Please wait**`, components: row });

	// For each song, set the requester, add the album art, and separate artist and title, then add them to the queue
	for (const song of songs) {
		// Set requester
		song.requester = requester.user;

		// If song image isn't set and artist is set, get album art from last.fm
		if (song.displayThumbnail) song.img = song.displayThumbnail('hqdefault');
		if (!song.img && song.author) {
			const img = await getCover(song.title, song.author, player).catch(err => client.logger.warn(err));
			if (img && typeof img === 'string') song.img = img;
		}

		// Set song color from album art
		if (song.img) song.colors = (await getColors(song.img, { count: 2 })).map(color => { return color.num(); });
		else song.colors = [0x212121, 0x4e4e4e];

		// If song image isn't set, set it to the default music image
		if (!song.img) song.img = 'https://cactie.smhsmh.club/assets/images/musicplaceholder.png';

		// If artist exists, set the title to the author and title separated by new lines
		if (song.author) song.title = `${song.title}\n${song.author}`;

		// Add songs to queue
		await player.queue[top ? 'unshift' : 'add'](song);
	}

	// If the player isn't playing, play it
	// eslint-disable-next-line no-inline-comments
	if (!player.playing) await player.play();

	// Send embed
	playMsg.edit({ content: `<:play:${play}> **${lang.music.search.found.replace('{query}', search)}**`, embeds: [PlayEmbed], components: row });

	// If the text channel is not the voice channel, send notice
	if (message.channel.id != player.textChannel) {
		const textChannel = client.channels.cache.get(player.textChannel);
		const textinvcmsg = await textChannel.send({ embeds: [PlayEmbed] });
		const textinvclink = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setURL(textinvcmsg.url)
				.setLabel('Go to channel')
				.setStyle(ButtonStyle.Link),
			]);

		PlayEmbed.setColor(0xff0000)
			.setDescription(`**I'm sending updates to ${textChannel}**\nClick the button below to go to the channel`)
			.setFooter({ text: 'You may also send commands in that channel' });
		message.channel.send({ embeds: [PlayEmbed], components: [textinvclink] });
	}

	// Create a collector for the undo button
	const filter = i => requester.id == i.user.id && i.customId.startsWith('music_');
	const collector = playMsg.createMessageComponentCollector({ filter, time: 60000 });
	collector.on('collect', async interaction => {
		// Defer the button
		interaction.deferUpdate();
		// Remove each song from the queue
		for (const song of songs) {
			const i = player.queue.indexOf(song);
			if (song == player.queue.current) player.stop();
			else if (i != -1) player.queue.remove(i);
		}
		// Reply and stop the collector
		const desc = PlayEmbed.toJSON().description.split('`');
		desc.shift();
		PlayEmbed.setDescription(`<:no:${no}> **${lang.music.added.un}** \`${desc.join('`')}`);
		playMsg.edit({ embeds: [PlayEmbed] });
		collector.stop();
		if (interaction.customId == 'music_search') {
			// Since playtop and play are so similar, use the same code in a function
			if (args.join(' ').includes(songs[0].identifier)) args = [songs[0].title.split('\n')[0]];
			playSongs(requester, message, args, client, lang, false, true);
		}
	});

	// When the collector stops, remove the undo button from it
	collector.on('end', () => playMsg.edit({ components: [] }));
};