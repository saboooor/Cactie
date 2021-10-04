const { MessageEmbed } = require('discord.js');
const { pause } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		if (player.paused) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`${pause} The player is already paused.`)
				.setTimestamp();
			return message.reply({ embeds: [thing] });
		}
		player.pause(true);
		const song = player.queue.current;
		let img = song.displayThumbnail ? song.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!img) img = DefaultThumbnail;
		const { body } = await got(img, { encoding: null });
		const palette = await splashy(body);
		const thing = new MessageEmbed()
			.setDescription(`${pause} **Paused**\n[${song.title}](${song.uri})`)
			.setColor(palette[3])
			.setTimestamp()
			.setThumbnail(img);
		return message.reply({ embeds: [thing] });
	},
};