const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { progressbar } = require('../../functions/progressbar.js');
const { music } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['playing', 'np'],
	guildOnly: true,
	player: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const song = player.queue.current;
		const total = song.duration;
		const current = player.position;
		const img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (message.guild.me.voice.serverMute) return message.reply({ content: 'I\'m server muted!', ephemeral: true });
		if (!song.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			song.color = palette[3];
		}
		const embed = new MessageEmbed()
			.setDescription(`${music} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('07:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('07:12:56', 'LIVE')}\``)
			.setThumbnail(img)
			.setColor(song.color);
		return message.reply({ embeds: [embed] });
	},
};