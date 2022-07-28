const { EmbedBuilder } = require('discord.js');
const convertTime = require('../../functions/music/convert.js');
const { forward, rewind } = require('../../lang/int/emoji.json');
const ms = require('ms');

module.exports = {
	name: 'seek',
	description: 'Seek through the playing song',
	args: true,
	usage: '<Time s/m/h>',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	options: require('../../options/seek.js'),
	async execute(message, args, client, lang) {
		try {
			// Get player and current song
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;

			// Get miliseconds from s/m/h and current position and song duration
			const time = ms(args[0]);
			const position = player.position;
			const duration = song.duration;

			// Create embed
			const SeekEmbed = new EmbedBuilder()
				.setColor('Random');

			// Check if time is less than duration, if so, then seek forward or backward and reply, or else send an error
			if (time <= duration) {
				player.seek(time);
				if (time > position) SeekEmbed.setDescription(`<:forward:${forward}> **${lang.music.track.seek.fwd}**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
				else SeekEmbed.setDescription(`<:rewind:${rewind}> **${lang.music.track.seek.rwd}**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
			}
			else {
				SeekEmbed.setColor(0xE74C3C)
					.setDescription(`${lang.music.track.seek.exceed} \`${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
			}
			message.reply({ embeds: [SeekEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};