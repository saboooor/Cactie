const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { TrackUtils } = require('erela.js');
const { convertTime } = require('./convert.js');
const getlfmCover = require('./getlfmCover.js');
const { play, music, warn, leave, no, srch } = require('../../lang/int/emoji.json');
module.exports = async function playSongs(requester, message, args, client, top, query) {
	// Get current voice channel and player, if player doesn't exist, create it in that channel
	const { channel } = requester.voice;
	let player = client.manager.get(message.guild.id);
	if (!player) {
		player = client.manager.create({
			guild: message.guild.id,
			voiceChannel: channel.id,
			textChannel: message.channel.id,
			volume: 50,
			selfDeafen: true,
		});
	}

	// If player isn't connected, connect it
	if (player.state != 'CONNECTED') player.connect();

	// Get search results from YouTube, Spotify, or Apple Music
	const search = args.join(' '); const songs = [];
	const playMsg = await message.reply({ content: `<:srch:${srch}> Searching for \`${search}\`...` });

	// Create embed for responses
	const PlayEmbed = new EmbedBuilder();

	// Create undo button
	const undo = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('music_undo')
				.setEmoji({ id: leave })
				.setLabel('Undo')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('music_search')
				.setEmoji({ id: srch })
				.setLabel('Not the right result?')
				.setStyle(ButtonStyle.Secondary),
		);
	const row = [];

	// Check if search is a spotify link, if not, search YouTube
	if (search.match(client.Lavasfy.spotifyPattern)) {
		// Get lavasfy token and node and search spotify
		await client.Lavasfy.requestToken();
		const node = await client.Lavasfy.getNode('lavamusic');
		const Searched = await node.load(search);

		// Get track and check if result is a playlist
		const track = Searched.tracks[0];
		if (Searched.loadType === 'PLAYLIST_LOADED') {
			// Add description to embed and build every song in the playlist
			PlayEmbed.setDescription(`<:music:${music}> **Added Playlist to ${top ? 'start of ' : ''}queue** \`[${Searched.tracks.length} songs]\`\n[${Searched.playlistInfo.name}](${search})`)
				.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() });
			await Searched.tracks.forEach(song => {
				// Some songs don't have a url, just use google lol
				if (!song.info.uri) song.info.uri = 'https://google.com';
				songs.push(TrackUtils.build(song));
			});
			row.push(undo);
		}
		else if (Searched.loadType.startsWith('TRACK')) {
			// Add description to embed and build the song
			PlayEmbed.setDescription(`<:music:${music}> **Added Song to ${top ? 'start of ' : ''}queue**\n[${track.info.title}](${track.info.uri})`)
				.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() });
			// Some songs don't have a url, just use google lol
			if (!track.info.uri) track.info.uri = 'https://google.com';
			songs.push(TrackUtils.build(track));
			row.push(undo);
		}
		else {
			// There's no result for the search, send error message
			PlayEmbed.setColor(0xE74C3C).setDescription(`<:alert:${warn}> **Failed to search** No results found.`);
			return playMsg.edit({ content: null, embeds: [PlayEmbed] });
		}
	}
	else {
		// Search YouTube
		const Searched = await player.search(search);

		if (query) {
			const tracks = Searched.tracks.slice(0, 5);
			const tracklist = tracks.map(track => {
				return `**${tracks.indexOf(track) + 1}** • [${track.title}\n${track.author}](${track.uri}) \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\``;
			});
			PlayEmbed.setDescription(`<:srch:${srch}> **Search Results**\n${tracklist.join('\n')}`);

			const balls = new ActionRowBuilder();
			for (let number = 1; number <= 5; number++) {
				balls.addComponents(
					new ButtonBuilder()
						.setCustomId(`${number}`)
						.setLabel(`${number}`)
						.setStyle(ButtonStyle.Secondary),
				);
			}
			row.push(balls);
			await playMsg.edit({ content: `<:srch:${srch}> Pick a search result from the buttons below\n\`Query: ${search}\``, embeds: [PlayEmbed], components: row });

			const collector = playMsg.createMessageComponentCollector({ time: 60000 });
			collector.on('collect', async interaction => {
				// Check if the user is the requester
				interaction.deferUpdate();
				playSongs(requester, playMsg, [Searched.tracks[interaction.customId - 1].uri], client, top, false);
				await playMsg.edit({ content: `<:play:${play}> **Selected result #${interaction.customId}**`, embeds: [], components: [] })
					.then(() => collector.stop());
			});

			// When the collector stops, remove the undo button from it
			collector.on('end', () => {
				if (playMsg.content.startsWith(`<:play:${play}> `)) return;
				playMsg.edit({ content: `<:alert:${warn}> **Search query selection timed out.**`, embeds: [], components: [] });
			});

			return;
		}

		// Get first track and check if result is not found or a playlist, if not, then just add the song
		const track = Searched.tracks[0];
		if (Searched.loadType === 'NO_MATCHES' || !track) {
			// There's no result for the search, send error message
			PlayEmbed.setColor(0xE74C3C).setDescription(`<:alert:${warn}> **Failed to search** No results found.`);
			return playMsg.edit({ content: null, embeds: [PlayEmbed] });
		}
		else if (Searched.loadType == 'PLAYLIST_LOADED') {
			// Add description to embed and push every song in the playlist
			PlayEmbed.setDescription(`<:music:${music}> **Added Playlist to ${top ? 'start of ' : ''}queue** \`[${Searched.tracks.length} songs / ${convertTime(Searched.playlist.duration)}]\`\n[${Searched.playlist.name}](${search})`)
				.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() });
			await Searched.tracks.forEach(song => {
				// Set image if thumbnail exists
				if (song.displayThumbnail) song.img = song.displayThumbnail('hqdefault');
				songs.push(song);
			});
			row.push(undo);
		}
		else {
			// Set image if thumbnail exists
			if (track.displayThumbnail) track.img = track.displayThumbnail('hqdefault');

			// Add description to embed and the song
			PlayEmbed.setDescription(`<:music:${music}> **Added Song to ${top ? 'start of ' : ''}queue** \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\`\n[${track.title}](${track.uri})`)
				.setFooter({ text: requester.user.tag, iconURL: requester.user.displayAvatarURL() })
				.setThumbnail(track.img);
			songs.push(Searched.tracks[0]);
			row.push(undo);
		}
	}

	// Playtop doesn't really matter if queue is empty
	top = player.queue.current && top;

	// If playtop, reverse list of songs to add them in the right order
	if (top) songs.reverse();

	// For each song, set the requester, add the album art, and separate artist and title, then add them to the queue
	for (const song of songs) {
		// Set requester
		song.requester = requester.user;

		// If song image isn't set and artist is set, get album art from last.fm
		if (!song.img && song.author) {
			const img = await getlfmCover(song.title, song.author.split(',')[0], client).catch(err => client.logger.warn(err));
			if (img && typeof img === 'string') song.img = img;
		}

		// If song image isn't set, set it to the default music image
		if (!song.img) song.img = 'https://cactie.smhsmh.club/assets/images/musicplaceholder.png';

		// Set song color (this will be replaced with the dominant color of the image if i find a good module for it)
		song.color = Math.floor(Math.random() * 16777215);

		// If artist exists, set the title to the author and title separated by new lines
		if (song.author) song.title = `${song.title}\n${song.author}`;

		// Add song to start of playlist
		await player.queue[top ? 'unshift' : 'add'](song);
	}

	// If the player isn't playing, play it
	if (!player.playing) await player.play();

	// Send embed
	playMsg.edit({ content: `<:play:${play}> **Found result for \`${search}\`**`, embeds: [PlayEmbed], components: row });

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
		PlayEmbed.setDescription(PlayEmbed.toJSON().description.replace('Added', 'Unadded').replace('to', 'from').replace(`<:music:${music}>`, `<:no:${no}>`));
		playMsg.edit({ embeds: [PlayEmbed] });
		collector.stop();
		if (interaction.customId == 'music_search') {
			// Since playtop and play are so similar, use the same code in a function
			if (args.join(' ').includes(songs[0].identifier)) args = [songs[0].title.split('\n')[0]];
			playSongs(requester, message, args, client, false, true);
		}
	});

	// When the collector stops, remove the undo button from it
	collector.on('end', () => playMsg.edit({ components: [] }));
};