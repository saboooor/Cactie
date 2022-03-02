const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;
			const embed = new MessageEmbed()
				.setDescription(`${msg.music.np}\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
				.setThumbnail(song.img)
				.setColor(song.color);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('music_updatenp')
						.setLabel('Update')
						.setStyle('SECONDARY'),
				);
			const npmsg = await message.reply({ embeds: [embed], components: [row] });

			// Set the now playing message
			if (!message.commandName) player.setNowplayingMessage(npmsg);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};