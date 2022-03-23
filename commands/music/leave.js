const { EmbedBuilder } = require('discord.js');
const { leave } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'leave',
	description: 'Leave voice channel',
	aliases: ['dc', 'fuckoff'],
	cooldown: 2,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get the player and destroy it
			const vc = message.guild.me.voice;
			if (!vc) return client.error(message.lang.music.notinvc, message, true);
			vc.leave();

			// Send message to channel
			const LeaveEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:out:${leave}> **${message.lang.music.left}**`);
			message.reply({ embeds: [LeaveEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};