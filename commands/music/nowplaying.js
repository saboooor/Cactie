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
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply(thing);
		}
		const song = player.queue.current;
		const total = song.duration;
		const current = player.position;
		let img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!img) img = DefaultThumbnail;
		const { body } = await got(img, { encoding: null });
		const palette = await splashy(body);
		const embed = new MessageEmbed()
			.setDescription(`${music} **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('07:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('07:12:56', 'LIVE')}\``)
			.setThumbnail(img)
			.setColor(palette[3]);
		return message.reply({ embeds: [embed] });
	},
};