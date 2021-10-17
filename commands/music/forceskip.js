const { MessageEmbed } = require('discord.js');
const { skip } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'forceskip',
	aliases: ['fs'],
	description: 'Force skip the currently playing song',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const autoplay = player.get('autoplay');
		const song = player.queue.current;
		if (autoplay === false) {
			player.stop();
		}
		else {
			player.stop();
			player.queue.clear();
			player.set('autoplay', false);
		}
		const img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!song.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			song.color = palette[3];
		}
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Force Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(img);
		return message.reply({ embeds: [thing] });
	},
};