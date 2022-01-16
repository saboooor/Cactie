const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const { convertTime } = require('../../functions/convert.js');
const { addsong, playlist, resume, warn } = require('../../config/emoji.json');
const { getColor } = require('colorthief');
const getlfmCover = require('../../functions/getlfmCover.js');
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
		const msg = await message.reply(`🔎 Searching for \`${search}\`...`);
		const slash = message.type && message.type == 'APPLICATION_COMMAND';
		const embed = new MessageEmbed().setTimestamp();
		if (search.match(client.Lavasfy.spotifyPattern)) {
			await client.Lavasfy.requestToken();
			const node = await client.Lavasfy.getNode('lavamusic');
			const Searched = await node.load(search);
			const track = Searched.tracks[0];
			if (Searched.loadType === 'PLAYLIST_LOADED') {
				embed.setDescription(`${playlist} **Added Playlist to queue**\n[${Searched.playlistInfo.name}](${search}) \`[${Searched.tracks.length} songs]\` [${message.member.user}]`);
				for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i]));
			}
			else if (Searched.loadType.startsWith('TRACK')) {
				embed.setDescription(`${playlist} **Added Song to queue**\n[${track.info.title}](${track.info.uri}) [${message.member.user}]`);
				songs.push(Searched.tracks[0]);
			}
			else {
				embed.setColor('RED').setDescription('No results found.');
				return slash ? message.editReply({ content: `${warn} **Failed to search**`, embeds: [embed] }) : msg.edit({ content: `${resume} **Found result for \`${search}\`!**`, embeds: [embed] });
			}
			track.img = 'https://i.imgur.com/cK7XIkw.png';
		}
		else {
			const Searched = await player.search(search);
			const track = Searched.tracks[0];
			if (Searched.loadType === 'NO_MATCHES') {
				embed.setColor('RED').setDescription('No results found.');
				return slash ? message.editReply({ content: `${warn} **Failed to search**`, embeds: [embed] }) : msg.edit({ content: `${resume} **Found result for \`${search}\`!**`, embeds: [embed] });
			}
			else if (Searched.loadType == 'PLAYLIST_LOADED') {
				embed.setDescription(`${playlist} **Added Playlist to queue**\n[${Searched.playlist.name}](${search}) \`[${Searched.tracks.length} songs]\` \`[${convertTime(Searched.playlist.duration)}]\` [${message.member.user}]`);
				for (let i = 0; i < Searched.tracks.length; i++) {
					if (Searched.tracks[i].displayThumbnail) Searched.tracks[i].img = Searched.tracks[i].displayThumbnail('hqdefault');
					songs.push(Searched.tracks[i]);
				}
			}
			else {
				if (track.displayThumbnail) track.img = track.displayThumbnail('hqdefault');
				embed.setDescription(`${addsong} **Added Song to queue**\n[${track.title}](${track.uri}) \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${message.member.user}]`)
					.setThumbnail(track.img);
				songs.push(Searched.tracks[0]);
			}
		}
		songs.forEach(async song => {
			song.requester = message.member.user;
			if (!song.img && song.author) {
				const img = await getlfmCover(song.title, song.author.split(',')[0], client).catch(e => client.logger.warn(e));
				if (img) song.img = img;
			}
			if (!song.img) {
				const Searched = await player.search(song.title + song.author ? ` ${song.author}` : '');
				const a = Searched.tracks[0];
				if (a && a.displayThumbnail) song.img = a.displayThumbnail('hqdefault');
			}
			if (song.img) song.color = await getColor(song.img);
			else song.color = Math.round(Math.random() * 16777215);
			if (song.author) song.title = `${song.title}\n${song.author}`;
		});
		songs.reverse();
		player.queue.reverse();
		player.queue.add(songs);
		player.queue.reverse();
		if (!player.playing) player.play();
		slash ? message.editReply({ content: `${resume} **Found result for \`${search}\`**`, embeds: [embed] }) : msg.edit({ content: `${resume} **Found result for \`${search}\`!**`, embeds: [embed] });
	},
};