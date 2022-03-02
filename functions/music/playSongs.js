const { Embed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const { convertTime } = require('./convert.js');
const getlfmCover = require('./getlfmCover.js');
const { play, music, warn } = require('../../lang/int/emoji.json');
module.exports = async function playSongs(message, args, client, top) {
	// Get current voice channel and player, if player doesn't exist, create it in that channel
	const { channel } = message.member.voice;
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
	const msg = await message.reply({ content: `🔎 Searching for \`${search}\`...` });

	// Check if slash command and use it later for responses
	const slash = message.commandName;

	// Create embed for responses
	const PlayEmbed = new Embed().setTimestamp();

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
			PlayEmbed.setDescription(`<:music:${music}> **Added Playlist to queue**\n[${Searched.playlistInfo.name}](${search})\n\`[${Searched.tracks.length} songs]\` [${message.member.user}]`);
			await Searched.tracks.forEach(song => {
				// Some songs don't have a url, just use google lol
				if (!song.info.uri) song.info.uri = 'https://google.com';
				songs.push(TrackUtils.build(song));
			});
		}
		else if (Searched.loadType.startsWith('TRACK')) {
			// Add description to embed and build the song
			PlayEmbed.setDescription(`<:music:${music}> **Added Song to queue**\n[${track.info.title}](${track.info.uri}) [${message.member.user}]`);
			// Some songs don't have a url, just use google lol
			if (!track.info.uri) track.info.uri = 'https://google.com';
			songs.push(TrackUtils.build(track));
		}
		else {
			// There's no result for the search, send error message
			PlayEmbed.setColor(0xE74C3C).setDescription('No results found.');
			return slash ? message.editReply({ content: `<:alert:${warn}> **Failed to search**`, embeds: [PlayEmbed] }) : msg.edit({ content: `<:alert:${warn}> **Failed to search**`, embeds: [PlayEmbed] });
		}
	}
	else {
		// Search YouTube
		const Searched = await player.search(search);
		// Get first track and check if result is not found or a playlist, if not, then just add the song
		const track = Searched.tracks[0];
		if (Searched.loadType === 'NO_MATCHES' || !track) {
			// There's no result for the search, send error message
			PlayEmbed.setColor(0xE74C3C).setDescription('No results found.');
			return slash ? message.editReply({ content: `<:alert:${warn}> **Failed to search**`, embeds: [PlayEmbed] }) : msg.edit({ content: `<:alert:${warn}> **Failed to search**`, embeds: [PlayEmbed] });
		}
		else if (Searched.loadType == 'PLAYLIST_LOADED') {
			// Add description to embed and push every song in the playlist
			PlayEmbed.setDescription(`🎶 **Added Playlist to queue**\n[${Searched.playlist.name}](${search})\n\`[${Searched.tracks.length} songs]\` \`[${convertTime(Searched.playlist.duration)}]\` [${message.member.user}]`);
			await Searched.tracks.forEach(song => {
				// Set image if thumbnail exists
				if (song.displayThumbnail) song.img = song.displayThumbnail('hqdefault');
				songs.push(song);
			});
		}
		else {
			// Set image if thumbnail exists
			if (track.displayThumbnail) track.img = track.displayThumbnail('hqdefault');

			// Add description to embed and the song
			PlayEmbed.setDescription(`<:music:${music}> **Added Song to queue**\n[${track.title}](${track.uri})\n\`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${message.member.user}]`)
				.setThumbnail(track.img);
			songs.push(Searched.tracks[0]);
		}
	}

	// Playtop doesn't really matter if queue is empty
	top = player.queue.current && top;

	// If playtop, reverse list of songs to add them in the right order
	if (top) songs.reverse();

	// For each song, set the requester, add the album art, and separate artist and title, then add them to the queue
	for (const song of songs) {
		// Set requester
		song.requester = message.member.user;

		// If song image isn't set and artist is set, get album art from last.fm
		if (!song.img && song.author) {
			const img = await getlfmCover(song.title, song.author.split(',')[0], client).catch(e => client.logger.warn(e));
			if (img && typeof img === 'string') song.img = img;
		}

		// If song image isn't set, set it to the default music image
		if (!song.img) song.img = 'https://pup.smhsmh.club/assets/images/musicplaceholder.png';

		// Set song color (this will be replaced with the dominant color of the image if i find a good module for it)
		song.color = Math.floor(Math.random() * 16777215);

		// If artist exists, set the title to the author and title separated by new lines
		if (song.author) song.title = `${song.title}\n${song.author}`;

		// Add song to start of playlist
		if (top) { await player.queue.unshift(song); }
		else {
			// Add song to start of playlist
			await player.queue.add(song);

			// If the player isn't playing, play it
			if (!player.playing) await player.play();
		}
	}

	// If the player isn't playing, play it
	if (!player.playing && top) await player.play();

	// Send embed
	slash ? message.editReply({ content: `<:play:${play}> **Found result for \`${search}\`**`, embeds: [PlayEmbed] }) : msg.edit({ content: `<:play:${play}> **Found result for \`${search}\`**`, embeds: [PlayEmbed] });
};