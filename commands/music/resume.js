function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { play } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'resume',
	description: 'Resume currently playing music',
	aliases: ['r', 'unpause'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get player and current song and check if already resumed
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			if (!player.paused) return client.error('The player is already playing.', message, true);

			// Unpause player and reply
			player.pause(false);
			const ResEmbed = new Embed()
				.setDescription(`<:play:${play}> **Resumed**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img);
			const resmsg = await message.reply({ embeds: [ResEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(ResEmbed)] }) : resmsg.edit({ embeds: [compressEmbed(ResEmbed)] });
		}
		catch (err) { client.error(err, message); }
	},
};