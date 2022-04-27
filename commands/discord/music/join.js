const { EmbedBuilder } = require('discord.js');
const { join } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'join',
	description: 'Join voice channel',
	aliases: ['j'],
	cooldown: 2,
	invc: true,
	async execute(message, args, client) {
		try {
			// Get the voice channel the user is in
			const { channel } = message.member.voice;

			let player = client.manager.get(message.guild.id);
			if (player) {
				if (!player.paused) return client.error(`${message.lang.music.alrplaying}\n${message.lang.music.join.move}`, message, true);
				player.voiceChannel = channel.id;
				player.textChannel = message.channel.id;
			}
			else {
				// Create player in that voice channel and connect to voice
				player = client.manager.create({
					guild: message.guild.id,
					voiceChannel: channel.id,
					textChannel: message.channel.id,
					volume: 50,
					selfDeafen: true,
				});
			}
			player.connect();

			// Send message to channel
			const JoinEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:in:${join}> **${message.lang.music.join.ed.replace('{vc}', `${channel}`).replace('{txt}', `${message.channel}`)}**`);
			message.reply({ embeds: [JoinEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};