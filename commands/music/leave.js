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
			const player = client.manager.get(message.guild.id);
			if (!player) return client.error('I\'m not in a voice chat!', message, true);
			player.destroy();

			// Send message to channel
			const LeaveEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:out:${leave}> **${message.lang.music.left}**`);
			message.reply({ embeds: [LeaveEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};