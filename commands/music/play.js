const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { play } = require('../../lang/int/emoji.json');
const playSongs = require('../../functions/music/playSongs.js');

module.exports = {
	name: 'play',
	description: 'Play music from YouTube, Spotify, or Apple Music',
	usage: '[Song URL/Name/Playlist URL]',
	aliases: ['p'],
	srvunmute: true,
	invc: true,
	samevc: true,
	options: require('../../options/play.js'),
	async execute(message, args, client, lang) {
		try {
			if (!args.length) {
				// Get player and current song and check if already resumed
				const player = client.manager.get(message.guild.id);
				if (!player || !player.queue.current) return client.error('Nothing is playing! Play something by doing the same command with a Song URL/Name/Playlist URL', message, true);
				const song = player.queue.current;
				if (!player.paused) return client.error(lang.music.alrplaying, message, true);

				// Unpause player and reply
				player.pause(false);
				const ResEmbed = new EmbedBuilder()
					.setDescription(`<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
					.setColor(song.colors[0])
					.setThumbnail(song.img);
				const resmsg = await message.reply({ embeds: [ResEmbed] });

				// Wait 10 seconds and compress the message
				await sleep(10000);
				if (message.commandName) message.editReply({ embeds: [compressEmbed(ResEmbed)] }).catch(err => logger.warn(err));
				else resmsg.edit({ embeds: [compressEmbed(ResEmbed)] }).catch(err => logger.warn(err));
				return;
			}
			// Since playtop and play are so similar, use the same code in a function
			playSongs(message.member, message, args, client, lang);
		}
		catch (err) { client.error(err, message); }
	},
};