const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { addsong, playlist } = require('../../config/emoji.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'playtop',
	description: 'Plays music to the top of the queue',
	usage: '<Song URL/Name>',
	aliases: ['pt', 'ptop'],
	args: true,
	guildOnly: true,
	inVoiceChannel: true,
	options: [{
		type: 3,
		name: 'song',
		description: 'Song URL/Name',
		required: true,
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		const { channel } = message.member.voice;
		let player = message.client.manager.get(message.guild.id);
		if (player && message.member.voice.channel !== message.guild.me.voice.channel) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`You must be in the same channel as ${message.client.user}`);
			return message.reply({ embeds: [thing] });
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
			player.queue.reverse();
			player.queue.add(track);
			player.queue.reverse();
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				const img = track.displayThumbnail ? track.displayThumbnail('hqdefault') : 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/musical-note_1f3b5.png';
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
			player.queue.reverse();
			player.queue.add(res.tracks);
			player.queue.reverse();
			if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
			thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${playlist} **Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist.name}** - \`[${convertTime(res.playlist.duration)}]\``);
			return message.channel.send({ embeds: [thing] });
		case 'SEARCH_RESULT':
			track = res.tracks[0];
			player.queue.reverse();
			player.queue.add(track);
			player.queue.reverse();
			if (!player.playing && !player.paused && !player.queue.size) {
				return player.play();
			}
			else {
				const img = track.displayThumbnail ? track.displayThumbnail('hqdefault') : 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/musical-note_1f3b5.png';
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