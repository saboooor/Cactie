const { MessageEmbed } = require('discord.js');
const { pause } = require('../../config/emoji.json');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	cooldown: 5,
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message) {
		const player = message.client.manager.get(message.guild.id);
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
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${pause} **Paused**\n[${song.title}](${song.uri})`);
		return message.reply({ embeds: [thing] });
	},
};