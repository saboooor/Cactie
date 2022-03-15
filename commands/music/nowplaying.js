const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { progressbar } = require('../../functions/music/progressbar.js');
const { shuffle, skip, music } = require('../../lang/int/emoji.json');
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
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;
			const embed = new MessageEmbed()
				.setDescription(`${msg.music.np} \`[${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}]\`\n[${song.title}](${song.uri})\n\`${progressbar(total, current, 20, '▬', '🔘')}\``)
				.setFooter({ text: song.requester.tag, iconURL: song.requester.displayAvatarURL() })
				.setThumbnail(song.img)
				.setColor(song.color);
			const row = new MessageActionRow()
				.addComponents([
					new MessageButton()
						.setCustomId('music_shuffle')
						.setEmoji(shuffle)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('music_skip')
						.setEmoji(skip)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('music_updatenp')
						.setLabel('Update')
						.setStyle('SECONDARY'),
				]);
			if (client.user.id == '848775888673439745') {
				row.addComponents(
					new MessageButton()
						.setURL('https://cactie.smhsmh.club/music')
						.setEmoji(music)
						.setLabel('Music Control Panel')
						.setStyle('LINK'),
				);
			}
			const npmsg = await message.reply({ embeds: [embed], components: [row] });

			// Set the now playing message
			if (!message.commandName) player.setNowplayingMessage(npmsg);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};