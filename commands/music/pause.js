const { MessageEmbed } = require('discord.js');
const { pause } = require('../../config/emoji.json');
const { getColor } = require('colorthief');
const rgb2hex = require('../../functions/rgbhex');
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
		if (player.paused) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`${pause} The player is already paused.`)
				.setTimestamp();
			return message.reply({ embeds: [thing] });
		}
		player.pause(true);
		const song = player.queue.current;
		if (!song.color) song.color = rgb2hex(await getColor(song.img));
		const thing = new MessageEmbed()
			.setDescription(`${pause} **Paused**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		return message.reply({ embeds: [thing] });
	},
};