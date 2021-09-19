const { MessageEmbed } = require('discord.js');
const { join } = require('../../config/emoji.json');
module.exports = {
	name: 'join',
	description: 'Join voice channel',
	aliases: ['j'],
	cooldown: 2,
	inVoiceChannel: true,
	sameVoiceChannel: false,
	async execute(message) {
		const { channel } = message.member.voice;
		if(!message.guild.me.voice.channel) {
			const player = message.client.manager.create({
				guild: message.guild.id,
				voiceChannel: channel.id,
				textChannel: message.channel.id,
				volume: 50,
				selfDeafen: true,
			});
			player.connect();
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`${join} **Join the voice channel**\nJoined <#${channel.id}> and bound to <#${message.channel.id}>`);
			return message.reply({ embeds: [thing] });
		}
		else if (message.guild.me.voice.channel !== channel) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`You must be in the same channel as ${message.client.user}`);
			return message.reply({ embeds: [thing] });
		}
	},
};