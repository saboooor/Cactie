const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const ms = require('ms');
const { forward, rewind } = require('../../config/emoji.json');
module.exports = {
	name: 'seek',
	description: 'Seek the currently playing song',
	args: true,
	usage: '<Time s/m/h>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args) {
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const time = ms(args[0]);
		const position = player.position;
		const duration = player.queue.current.duration;
		const song = player.queue.current;
		if (time <= duration) {
			if (time > position) {
				player.seek(time);
				const thing = new MessageEmbed()
					.setDescription(`${forward} **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
			else {
				player.seek(time);
				const thing = new MessageEmbed()
					.setDescription(`${rewind} **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
		}
		else {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${convertTime(duration)}\``);
			return message.reply({ embeds: [thing] });
		}
	},
};