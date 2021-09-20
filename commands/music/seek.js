const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const ms = require('ms');
const { forward, rewind } = require('../../config/emoji.json');
module.exports = {
	name: 'seek',
	description: 'Seek through the playing song',
	args: true,
	usage: '<Time s/m/h>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	options: [{
		type: 3,
		name: 'time',
		description: 'Time s/m/h (Ex. 10s, 2m)',
		required: true,
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
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
					.setDescription(`${forward} **Forward**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('07:12:56', 'LIVE')}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
			else {
				player.seek(time);
				const thing = new MessageEmbed()
					.setDescription(`${rewind} **Rewind**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration).replace('07:12:56', 'LIVE')}\``)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}
		}
		else {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Seek duration exceeds Song duration.\nSong duration: \`${convertTime(duration).replace('07:12:56', 'LIVE')}\``);
			return message.reply({ embeds: [thing] });
		}
	},
};