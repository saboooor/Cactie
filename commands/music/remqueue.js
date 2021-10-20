const { MessageEmbed } = require('discord.js');
const { remove } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'remqueue',
	description: 'Delete a song from the queue',
	aliases: ['removequeue', 'rmq'],
	args: true,
	usage: '<Index of song in queue>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/index.json'),
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const position = (Number(args[0]) - 1);
		if (position > player.queue.size) {
			const number = (position + 1);
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
			return message.reply({ embeds: [thing] });
		}
		const song = player.queue[position];
		const img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		player.queue.remove(position);
		if (!song.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			song.color = palette[3];
		}
		const thing = new MessageEmbed()
			.setDescription(`${remove} **Removed**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(img);
		return message.reply({ embeds: [thing] });
	},
};