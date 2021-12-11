const { MessageEmbed } = require('discord.js');
const { stop } = require('../../config/emoji.json');
module.exports = {
	name: 'stop',
	description: 'Stops the music',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		player.stop();
		player.queue.clear();
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${stop} Stopped the music`);
		message.reply({ embeds: [thing] });
	},
};