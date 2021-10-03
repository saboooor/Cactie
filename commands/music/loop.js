const { MessageEmbed } = require('discord.js');
const { loop } = require('../../config/emoji.json');
module.exports = {
	name: 'loop',
	description: 'Toggle music loop',
	aliases: ['l'],
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
		player.setTrackRepeat(!player.trackRepeat);
		const trackRepeat = player.trackRepeat ? 'enabled' : 'disabled';
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${loop} Loop track is now **${trackRepeat}**`);
		return message.reply({ embeds: [thing] });
	},
};