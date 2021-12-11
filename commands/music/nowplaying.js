const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { progressbar } = require('../../functions/progressbar.js');
const { music } = require('../../config/emoji.json');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['playing', 'np'],
	guildOnly: true,
	serverUnmute: true,
	player: true,
	async execute(message, args, client) {
		let player = client.manager.get(message.guild.id);
		let song = player.queue.current;
		let total = song.duration;
		let current = player.position;
		let embed = new MessageEmbed()
			.setDescription(`${music} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
			.setThumbnail(song.img)
			.setColor(song.color);
		const msg = await message.channel.send({ embeds: [embed] });
		player.set('nowplayingMSG', msg);
		const interval = setInterval(() => {
			player = client.manager.get(message.guild.id);
			song = player.queue.current;
			if (!song) {
				if (player?.get('nowplayingMSG')) player?.get('nowplayingMSG').delete();
				return clearInterval(interval);
			}
			total = song.duration;
			current = player.position;
			embed = new MessageEmbed()
				.setDescription(`${music} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
				.setThumbnail(song.img)
				.setColor(song.color);
			player?.get('nowplayingMSG') ? player.get('nowplayingMSG').edit({ embeds: [embed] }, '') :
				message.channel.send({ embeds: [embed] }).then(msg2 => player.set('nowplayingMSG', msg2));
		}, 5000);
		player.set('nowplaying', interval);
	},
};