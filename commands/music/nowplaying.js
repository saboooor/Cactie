const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { progressbar } = require('../../functions/music/progressbar.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['playing', 'np'],
	serverUnmute: true,
	player: true,
	ephemeral: true,
	async execute(message, args, client) {
		try {
			// Get player, current song, and song position / length and send embed
			let player = client.manager.get(message.guild.id);
			let song = player.queue.current;
			let total = song.duration;
			let current = player.position;
			let embed = new MessageEmbed()
				.setDescription(`${msg.music.np}\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
				.setThumbnail(song.img)
				.setColor(song.color);
			const npmsg = await message.channel.send({ embeds: [embed] });

			// Set the now playing message and update it every 5 seconds
			player.set('nowplayingMSG', npmsg);
			if (message.commandName) message.reply({ content: 'Message sent.' });
			const interval = setInterval(() => {
			// Get the player and current song
				player = client.manager.get(message.guild.id);
				song = player.queue.current;

				// If there's no song playing, clear the interval and delete the message
				if (!song) {
					if (player?.get('nowplayingMSG')) player?.get('nowplayingMSG').delete().catch(e => client.logger.error(e));
					return clearInterval(interval);
				}

				// Get the song position / length and edit the embed
				total = song.duration;
				current = player.position;
				embed = new MessageEmbed()
					.setDescription(`${msg.music.np}\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
					.setThumbnail(song.img)
					.setColor(song.color);
				player?.get('nowplayingMSG') ? player.get('nowplayingMSG').edit({ embeds: [embed] }, '') :
					message.channel.send({ embeds: [embed] }).then(msg2 => player.set('nowplayingMSG', msg2));
			}, 5000);
			player.set('nowplaying', interval);
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};