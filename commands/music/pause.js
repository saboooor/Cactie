function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { pause } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and check if already paused
			const player = client.manager.get(message.guild.id);
			if (player.paused) {
				const PauseEmbed = new Embed()
					.setColor(0xE74C3C)
					.setDescription(`<:pause:${pause}> The player is already paused.`);
				return message.reply({ embeds: [PauseEmbed] });
			}

			// Pause the player
			player.pause(true);

			// Send message to channel with current song
			const song = player.queue.current;
			const PauseEmbed = new Embed()
				.setDescription(`<:pause:${pause}> **Paused**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img);
			const pausemsg = await message.reply({ embeds: [PauseEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(PauseEmbed)] }) : pausemsg.edit({ embeds: [compressEmbed(PauseEmbed)] });
			message.reply({ embeds: [PauseEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};