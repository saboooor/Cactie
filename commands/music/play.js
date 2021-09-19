const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { addsong, playlist } = require('../../config/emoji.json');
module.exports = {
	name: 'play',
	description: 'Plays audio from YouTube or Spotify',
	usage: '<Song URL/Name>',
	aliases: ['p'],
	cooldown: 5,
	args: true,
	inVoiceChannel: true,
	async execute(message, args) {
		const { channel } = message.member.voice;
		let player = message.client.manager.get(message.guild.id);
		if (player && message.member.voice.channel !== message.guild.me.voice.channel) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`You must be in the same channel as ${message.client.user}`);
			message.reply({ embeds: [thing] });
		}
		else if (!player) {
			player = message.client.manager.create({
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
		let res;
		try {
			res = await player.search(search, message.author);
			if (res.loadType === 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		}
		catch (err) {
			return message.reply(`there was an error while searching: ${err.message}`);
		}
		let thing = null;
		let track = null;
		switch (res.loadType) {
		case 'NO_MATCHES':
			if (!player.queue.current) player.destroy();
			return message.reply('there were no results found.');
		case 'TRACK_LOADED':
			track = res.tracks[0];
			player.queue.add(track);
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				thing = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp()
					.setThumbnail(track.displayThumbnail('hqdefault'))
					.setDescription(`${addsong} **Added Song to queue**\n[${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\``);
				return message.reply({ embeds: [thing] });
			}
		case 'PLAYLIST_LOADED':
			player.queue.add(res.tracks);
			if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
			thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${playlist} **Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist.name}** - \`[${convertTime(res.playlist.duration)}]\``);
			return message.reply({ embeds: [thing] });
		case 'SEARCH_RESULT':
			track = res.tracks[0];
			player.queue.add(track);
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				thing = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp()
					.setThumbnail(track.displayThumbnail('hqdefault'))
					.setDescription(`${addsong} **Added Song to queue**\n[${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\`[<@${track.requester.id}>]`);
				return message.reply({ embeds: [thing] });
			}
		}
	},
};