function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { pause, play } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'pause',
	description: 'Pause/Unpause the currently playing music',
	aliases: ['r', 'resume', 'unpause'],
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get player and check if already paused
			const player = client.manager.get(message.guild.id);

			// Pause the player
			player.pause(!player.paused);

			// Send message to channel with current song
			const song = player.queue.current;
			const PauseEmbed = new EmbedBuilder()
				.setDescription(player.paused ? `<:pause:${pause}> **${lang.music.pause.ed}**\n[${song.title}](${song.uri})` : `<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
				.setColor(song.colors[0])
				.setThumbnail(song.img)
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.avatarURL() });
			const pausemsg = await message.reply({ embeds: [PauseEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			pausemsg.edit({ embeds: [compressEmbed(PauseEmbed)] }).catch(err => client.logger.error(err));
		}
		catch (err) { client.error(err, message); }
	},
};
