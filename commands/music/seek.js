const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const ms = require('ms');
const { forward, rewind } = require('../../config/emoji.json');
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
		const player = client.manager.get(message.guild.id);
		const song = player.queue.current;
		const time = ms(args[0]);
		const position = player.position;
		const duration = song.duration;
		if (time <= duration) {
			if (time > position) {
				player.seek(time);
				const thing = new MessageEmbed()
					.setDescription(`${forward} **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
			else {
				player.seek(time);
				const thing = new MessageEmbed()
					.setDescription(`${rewind} **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('7:12:56', 'LIVE')}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
		}
		else {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${convertTime(duration).replace('7:12:56', 'LIVE')}\``);
			return message.reply({ embeds: [thing] });
		}
	},
};