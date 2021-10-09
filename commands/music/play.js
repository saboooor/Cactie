const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { addsong, playlist } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'play',
	description: 'Play music from YouTube or Spotify',
	usage: '<Song URL/Name/Playlist URL>',
	aliases: ['p'],
	args: true,
	guildOnly: true,
	inVoiceChannel: true,
	options: require('./play.json'),
	async execute(message, args, client) {
		const { channel } = message.member.voice;
		let player = client.manager.get(message.guild.id);
		if (player && message.member.voice.channel !== message.guild.me.voice.channel) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`You must be in the same channel as ${client.user}`);
			return message.reply({ embeds: [thing] });
		}
		else if (!player) {
			player = client.manager.create({
				guild: message.guild.id,
				voiceChannel: channel.id,
				textChannel: message.channel.id,
				volume: 50,
				selfDeafen: true,
			});
		}
		if (player.state !== 'CONNECTED') player.connect();
		player.set('autoplay', false);
		const search = args.join(' ');
		message.reply(`🔎 Searching for \`${search}\`...`);
		let res;
		try {
			res = await player.search(search, message.member.user);
			if (res.loadType === 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		}
		catch (err) {
			return message.channel.send({ content: `there was an error while searching: ${err.message}` });
		}
		let thing = null;
		let track = null;
		switch (res.loadType) {
		case 'NO_MATCHES':
			if (!player.queue.current) player.destroy();
			return message.channel.send({ content: 'there were no results found.' });
		case 'TRACK_LOADED':
			track = res.tracks[0];
			player.queue.add(track);
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				let img = track.displayThumbnail ? track.displayThumbnail('hqdefault') : DefaultThumbnail;
				if (!img) img = DefaultThumbnail;
				const { body } = await got(img, { encoding: null });
				const palette = await splashy(body);
				thing = new MessageEmbed()
					.setColor(palette[3])
					.setTimestamp()
					.setThumbnail(img)
					.setDescription(`${addsong} **Added Song to queue**\n[${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\``);
				return message.channel.send({ embeds: [thing] });
			}
		case 'PLAYLIST_LOADED':
			player.queue.add(res.tracks);
			if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
			thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${playlist} **Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist.name}** - \`[${convertTime(res.playlist.duration)}]\``);
			return message.channel.send({ embeds: [thing] });
		case 'SEARCH_RESULT':
			track = res.tracks[0];
			player.queue.add(track);
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				let img = track.displayThumbnail ? track.displayThumbnail('hqdefault') : DefaultThumbnail;
				if (!img) img = DefaultThumbnail;
				const { body } = await got(img, { encoding: null });
				const palette = await splashy(body);
				thing = new MessageEmbed()
					.setColor(palette[3])
					.setTimestamp()
					.setThumbnail(img)
					.setDescription(`${addsong} **Added Song to queue**\n[${track.title}](${track.uri}) - \`[${convertTime(track.duration).replace('07:12:56', 'LIVE')}]\`[${track.requester}]`);
				return message.channel.send({ embeds: [thing] });
			}
		}
	},
};