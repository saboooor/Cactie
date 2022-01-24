const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const ms = require('ms');
module.exports = {
	name: 'seek',
	description: 'Seek through the playing song',
	args: true,
	usage: '<Time s/m/h>',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/seek.json'),
	async execute(message, args, client) {
		// Get player and current song
		const player = client.manager.get(message.guild.id);
		const song = player.queue.current;

		// Get miliseconds from s/m/h and current position and song duration
		const time = ms(args[0]);
		const position = player.position;
		const duration = song.duration;

		// Create embed
		const embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();

		// Check if time is less than duration, if so, then seek forward or backward and reply, or else send an error
		if (time <= duration) {
			player.seek(time);
			if (time > position) embed.setDescription(`⏩ **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
			else embed.setDescription(`⏪ **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
		}
		else {
			embed.setColor('RED')
				.setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
		}
		return message.reply({ embeds: [embed] });
	},
};