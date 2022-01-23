const { MessageEmbed } = require('discord.js');
const { pause } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
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
		const thing = new MessageEmbed()
			.setDescription(`${pause} **Paused**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		return message.reply({ embeds: [thing] });
	},
};