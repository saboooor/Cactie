function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../../functions/compressEmbed');
const { pause } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and check if already paused
			const player = client.manager.get(message.guild.id);
			if (player.paused) return client.error(message.lang.music.pause.alr, message, true);

			// Pause the player
			player.pause(true);

			// Send message to channel with current song
			const song = player.queue.current;
			const PauseEmbed = new EmbedBuilder()
				.setDescription(`<:pause:${pause}> **${message.lang.music.pause.ed}**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img);
			const pausemsg = await message.reply({ embeds: [PauseEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(PauseEmbed)] }) : pausemsg.edit({ embeds: [compressEmbed(PauseEmbed)] });
		}
		catch (err) { client.error(err, message); }
	},
};
