const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { progressbar } = require('../../functions/progressbar.js');
const { music } = require('../../config/emoji.json');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['np'],
	cooldown: 5,
	guildOnly: true,
	player: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply(thing);
		}
		const song = player.queue.current;
		const total = song.duration;
		const current = player.position;
		const size = 20;
		const line = '▬';
		const slider = '🔘';
		const embed = new MessageEmbed()
			.setDescription(`${music} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration)}]\` [<@${song.requester.id}>]`)
			.setThumbnail(song.displayThumbnail('3'))
			.setColor(Math.round(Math.random() * 16777215))
			.addField('\u200b', progressbar(total, current, size, line, slider))
			.addField('\u200b', `\`${convertTime(current)} / ${convertTime(total)}\``);
		return message.reply({ embeds: [embed] });
	},
};