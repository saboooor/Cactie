const { MessageEmbed } = require('discord.js');
const { join } = require('../../config/emoji.json');
module.exports = {
	name: 'join',
	description: 'Join voice channel',
	aliases: ['j'],
	cooldown: 2,
	guildOnly: true,
	inVoiceChannel: true,
	async execute(message, args, client) {
		const { channel } = message.member.voice;
		if (!message.guild.me.voice.channel) {
			const player = client.manager.create({
				guild: message.guild.id,
				voiceChannel: channel.id,
				textChannel: message.channel.id,
				volume: 50,
				selfDeafen: true,
			});
			player.connect();
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`${join} **Joined VC**\nJoined ${channel} and bound to ${message.channel}`);
			return message.reply({ embeds: [thing] });
		}
	},
};