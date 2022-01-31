const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const { convertTime } = require('../../functions/music/convert.js');
const getlfmCover = require('../../functions/music/getlfmCover.js');
module.exports = {
	name: 'playtop',
	description: 'Play music to the top of the queue',
	usage: '<Song URL/Name/Playlist URL>',
	aliases: ['pt', 'ptop'],
	args: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChanne: true,
	djRole: true,
	options: require('../options/play.json'),
	async execute(message, args, client) {
		try {
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
			if (player.state != 'CONNECTED') player.connect();
			const search = args.join(' '); const songs = [];
			const msg = await message.reply({ content: `🔎 Searching for \`${search}\`...` });
			const slash = message.type && message.type == 'APPLICATION_COMMAND';
			const embed = new MessageEmbed().setTimestamp();
			if (search.match(client.Lavasfy.spotifyPattern)) {
				await client.Lavasfy.requestToken();
				const node = await client.Lavasfy.getNode('lavamusic');
				const Searched = await node.load(search);
				const track = Searched.tracks[0];
				if (Searched.loadType === 'PLAYLIST_LOADED') {
					embed.setDescription(`🎶 **Added Playlist to queue**\n[${Searched.playlistInfo.name}](${search}) \`[${Searched.tracks.length} songs]\` [${message.member.user}]`);
					await Searched.tracks.forEach(song => {
						if (!song.info.uri) song.info.uri = 'https://google.com';
						songs.push(TrackUtils.build(song));
					});
				}
				else if (Searched.loadType.startsWith('TRACK')) {
					embed.setDescription(`🎶 **Added Song to queue**\n[${track.info.title}](${track.info.uri}) [${message.member.user}]`);
					if (!track.info.uri) track.info.uri = 'https://google.com';
					songs.push(TrackUtils.build(track));
				}
				else {
					embed.setColor('RED').setDescription('No results found.');
					return slash ? message.editReply({ content: '⚠️ **Failed to search**', embeds: [embed] }) : msg.edit({ content: '⚠️ **Failed to search**', embeds: [embed] });
				}
			}
			else {
				const Searched = await player.search(search);
				const track = Searched.tracks[0];
				if (Searched.loadType === 'NO_MATCHES') {
					embed.setColor('RED').setDescription('No results found.');
					return slash ? message.editReply({ content: '⚠️ **Failed to search**', embeds: [embed] }) : msg.edit({ content: '⚠️ **Failed to search**', embeds: [embed] });
				}
				else if (Searched.loadType == 'PLAYLIST_LOADED') {
					embed.setDescription(`🎶 **Added Playlist to queue**\n[${Searched.playlist.name}](${search}) \`[${Searched.tracks.length} songs]\` \`[${convertTime(Searched.playlist.duration)}]\` [${message.member.user}]`);
					await Searched.tracks.forEach(song => {
						if (song.displayThumbnail) song.img = song.displayThumbnail('hqdefault');
						songs.push(song);
					});
				}
				else {
					if (track.displayThumbnail) track.img = track.displayThumbnail('hqdefault');
					embed.setDescription(`🎵 **Added Song to queue**\n[${track.title}](${track.uri}) \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${message.member.user}]`)
						.setThumbnail(track.img);
					songs.push(Searched.tracks[0]);
				}
			}
			songs.forEach(async song => {
				song.requester = message.member.user;
				if (!song.img && song.author) {
					const img = await getlfmCover(song.title, song.author.split(',')[0], client).catch(e => client.logger.warn(e));
					if (img && typeof img === 'string') song.img = img;
				}
				if (!song.img) song.img = 'https://pup.smhsmh.club/assets/images/musicplaceholder.png';
				song.color = [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)];
				if (song.author) song.title = `${song.title}\n${song.author}`;
			});
			songs.reverse();
			player.queue.reverse();
			await player.queue.add(songs);
			player.queue.reverse();
			if (!player.playing) await player.play();
			slash ? message.editReply({ content: `▶️ **Found result for \`${search}\`**`, embeds: [embed] }) : msg.edit({ content: `▶️ **Found result for \`${search}\`**`, embeds: [embed] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};